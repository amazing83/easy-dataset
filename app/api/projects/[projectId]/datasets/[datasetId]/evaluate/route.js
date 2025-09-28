import { NextResponse } from 'next/server';
import { getDatasetsById, updateDatasetEvaluation } from '@/lib/db/datasets';
import { getChunkById } from '@/lib/db/chunks';
import { getDatasetEvaluationPrompt } from '@/lib/llm/prompts/datasetEvaluation';
import { extractJsonFromLLMOutput } from '@/lib/llm/common/util';
import LLMClient from '@/lib/llm/core/index';

/**
 * 评估单个数据集的质量
 */
export async function POST(request, { params }) {
  try {
    const { projectId, datasetId } = params;
    const { model, language = '中文' } = await request.json();

    if (!projectId || !datasetId) {
      return NextResponse.json({ success: false, message: '项目ID和数据集ID不能为空' }, { status: 400 });
    }

    if (!model) {
      return NextResponse.json({ success: false, message: '模型配置不能为空' }, { status: 400 });
    }

    // 1. 获取数据集信息
    const dataset = await getDatasetsById(datasetId);
    if (!dataset) {
      return NextResponse.json({ success: false, message: '数据集不存在' }, { status: 404 });
    }

    if (dataset.projectId !== projectId) {
      return NextResponse.json({ success: false, message: '数据集不属于指定项目' }, { status: 403 });
    }

    // 2. 根据 questionId 获取原始文本块内容
    let chunkContent = dataset.chunkContent || '';

    // 如果数据集中没有 chunkContent，尝试通过 questionId 查找
    if (!chunkContent && dataset.questionId) {
      try {
        // 查找对应的问题，然后获取 chunk 内容
        const { getQuestionById } = await import('@/lib/db/questions');
        const question = await getQuestionById(dataset.questionId);
        if (question && question.chunkId) {
          const chunk = await getChunkById(question.chunkId);
          if (chunk) {
            // 检查是否是蒸馏内容
            if (chunk.name === 'Distilled Content') {
              chunkContent = 'Distilled Content - 没有原始文本参考';
            } else {
              chunkContent = chunk.content;
            }
          }
        }
      } catch (error) {
        console.warn('无法获取原始文本块内容:', error.message);
        // 如果无法获取 chunk 内容，使用已有的 chunkContent
        chunkContent = dataset.chunkContent || '';
      }
    }

    // 检查是否是蒸馏内容
    if (dataset.chunkName === 'Distilled Content' || chunkContent.includes('Distilled Content')) {
      chunkContent = 'Distilled Content - 没有原始文本参考';
    }

    // 3. 生成评估提示词
    const prompt = await getDatasetEvaluationPrompt(
      language,
      {
        chunkContent,
        question: dataset.question,
        answer: dataset.answer
      },
      projectId
    );

    // 4. 调用 LLM 进行评估
    const llmClient = new LLMClient(model);
    const response = await llmClient.getResponse(prompt);

    // 5. 解析评估结果
    let evaluationResult;
    try {
      evaluationResult = extractJsonFromLLMOutput(response);

      if (!evaluationResult || typeof evaluationResult.score !== 'number' || !evaluationResult.evaluation) {
        throw new Error('评估结果格式错误');
      }

      // 验证评分范围
      if (evaluationResult.score < 0 || evaluationResult.score > 5) {
        throw new Error('评分超出范围');
      }

      // 确保评分精确到 0.5
      evaluationResult.score = Math.round(evaluationResult.score * 2) / 2;
    } catch (error) {
      console.error('解析评估结果失败:', error);
      return NextResponse.json({ success: false, message: 'AI评估结果解析失败，请重试' }, { status: 500 });
    }

    // 6. 更新数据集评估结果
    await updateDatasetEvaluation(datasetId, evaluationResult.score, evaluationResult.evaluation);

    return NextResponse.json({
      success: true,
      message: '数据集评估完成',
      data: {
        score: evaluationResult.score,
        aiEvaluation: evaluationResult.evaluation
      }
    });
  } catch (error) {
    console.error('数据集评估失败:', error);
    return NextResponse.json({ success: false, message: `评估失败: ${error.message}` }, { status: 500 });
  }
}
