import { removeLeadingNumber } from '../common/util';

const DISTILL_QUESTIONS_PROMPT = `
你是一个专业的知识问题生成助手，精通{{currentTag}}领域的知识。我需要你帮我为标签"{{currentTag}}"生成{{count}}个高质量、多样化的问题。

标签完整链路是：{{tagPath}}

请遵循以下规则：
1. 生成的问题必须与"{{currentTag}}"主题紧密相关，确保全面覆盖该主题的核心知识点和关键概念
2. 问题应该均衡分布在以下难度级别(每个级别至少占20%):
   - 基础级：适合入门者，关注基本概念、定义和简单应用
   - 中级：需要一定领域知识，涉及原理解释、案例分析和应用场景
   - 高级：需要深度思考，包括前沿发展、跨领域联系、复杂问题解决方案等

3. 问题类型应多样化，包括但不限于（以下只是参考，可以根据实际情况灵活调整，不一定要限定下面的主题）：
   - 概念解释类："什么是..."、"如何定义..."
   - 原理分析类："为什么..."、"如何解释..."
   - 比较对比类："...与...有何区别"、"...相比...的优势是什么"
   - 应用实践类："如何应用...解决..."、"...的最佳实践是什么"
   - 发展趋势类："...的未来发展方向是什么"、"...面临的挑战有哪些"
   - 案例分析类："请分析...案例中的..."
   - 启发思考类："如果...会怎样"、"如何评价..."

4. 问题表述要清晰、准确、专业，避免以下问题：
   - 避免模糊或过于宽泛的表述
   - 避免可以简单用"是/否"回答的封闭性问题
   - 避免包含误导性假设的问题
   - 避免重复或高度相似的问题
   
5. 问题的深度和广度要适当（以下只是参考，可以根据实际情况灵活调整，不一定要限定下面的主题）：
   - 覆盖主题的历史、现状、理论基础和实际应用
   - 包含该领域的主流观点和争议话题
   - 考虑该主题与相关领域的交叉关联
   - 关注该领域的新兴技术、方法或趋势

{{existingQuestions}}

请直接以JSON数组格式返回问题，不要有任何额外的解释或说明，格式如下：

["问题1", "问题2", "问题3", ...]

注意：每个问题应该是完整的、自包含的，无需依赖其他上下文即可理解和回答。
`;

export const DISTILL_QUESTIONS_PROMPT_EN = `
You are a professional knowledge question generation assistant, proficient in the field of {{currentTag}}. I need you to help me generate {{count}} high-quality, diverse questions for the tag "{{currentTag}}".
The complete tag path is: {{tagPath}}

Please follow these rules:
1. The generated questions must be closely related to the topic of "{{currentTag}}", ensuring comprehensive coverage of the core knowledge points and key concepts of this topic.
2. Questions should be evenly distributed across the following difficulty levels (each level should account for at least 20%):
   - Basic: Suitable for beginners, focusing on basic concepts, definitions, and simple applications.
   - Intermediate: Requires some domain knowledge, involving principle explanations, case analyses, and application scenarios.
   - Advanced: Requires in-depth thinking, including cutting-edge developments, cross-domain connections, complex problem solutions, etc.

3. Question types should be diverse, including but not limited to (the following are just references and can be adjusted flexibly according to the actual situation; there is no need to limit to the following topics):
   - Conceptual explanation: "What is...", "How to define..."
   - Principle analysis: "Why...", "How to explain..."
   - Comparison and contrast: "What is the difference between... and...", "What are the advantages of... compared to..."
   - Application practice: "How to apply... to solve...", "What is the best practice for..."
   - Development trends: "What is the future development direction of...", "What challenges does... face?"
   - Case analysis: "Please analyze... in the case of..."
   - Thought-provoking: "What would happen if...", "How to evaluate..."

4. Question phrasing should be clear, accurate, and professional. Avoid the following:
   - Avoid vague or overly broad phrasing.
   - Avoid closed-ended questions that can be answered with "yes/no".
   - Avoid questions containing misleading assumptions.
   - Avoid repetitive or highly similar questions.

5. The depth and breadth of questions should be appropriate:
   - Cover the history, current situation, theoretical basis, and practical applications of the topic.
   - Include mainstream views and controversial topics in the field.
   - Consider the cross-associations between this topic and related fields.
   - Focus on emerging technologies, methods, or trends in this field.

{{existingQuestionsText}}

Please directly return the questions in the format of a JSON array, without any additional explanations or notes, in the following format:
["Question 1", "Question 2", "Question 3", ...]

Note: Each question should be complete and self-contained, understandable and answerable without relying on other contexts.
`;

/**
 * 根据标签构造问题的提示词
 * @param {string} tagPath - 标签链路，例如 "体育->足球->足球先生"
 * @param {string} currentTag - 当前子标签，例如 "足球先生"
 * @param {number} count - 希望生成问题的数量，例如：10
 * @param {Array<string>} existingQuestions - 当前标签已经生成的问题（避免重复）
 * @param {string} globalPrompt - 项目全局提示词
 * @returns {string} 提示词
 */
export function distillQuestionsPrompt(language, { tagPath, currentTag, count = 10, existingQuestions = [] }) {
  currentTag = removeLeadingNumber(currentTag);
  const existingQuestionsText =
    existingQuestions.length > 0
      ? `已有的问题包括：\n${existingQuestions.map(q => `- ${q}`).join('\n')}\n请不要生成与这些重复或高度相似的问题。`
      : '';
  const existingQuestionsTextEn =
    existingQuestions.length > 0
      ? `Existing questions include: \n${existingQuestions.map(q => `- ${q}`).join('\n')}\nPlease do not generate duplicate or highly similar questions.`
      : '';
  const prompt = (language === 'en' ? DISTILL_QUESTIONS_PROMPT_EN : DISTILL_QUESTIONS_PROMPT)
    .replaceAll('{{currentTag}}', currentTag)
    .replaceAll('{{count}}', count)
    .replaceAll('{{tagPath}}', tagPath)
    .replaceAll('{{existingQuestions}}', language === 'en' ? existingQuestionsTextEn : existingQuestionsText);
  console.log(444, prompt);
  return prompt;
}
