/**
 * 领域树增量修订提示词
 * 用于在已有领域树的基础上，针对新增/删除的文献内容，对领域树进行增量调整
 */

export const LABEL_REVISE_PROMPT = `
我需要你帮我修订一个已有的领域树结构，使其能够适应内容的变化。

## 之前的领域树结构
以下是之前完整的领域树结构（JSON格式）：
{{existingTags}}

## 之前完整文献的目录
以下是当前系统中所有文献的目录结构总览：
{{text}}

{{deletedContent}}

{{newContent}}

## 要求
请分析上述信息，修订现有的领域树结构，遵循以下原则：
1. 保持领域树的总体结构稳定，避免大规模重构
2. 对于删除的内容相关的领域标签：
   - 如果某个标签仅与删除的内容相关，且在现有文献中找不到相应内容支持，则移除该标签
   - 如果某个标签同时与其他保留的内容相关，则保留该标签
3. 对于新增的内容：
   - 如果新内容可以归类到现有的标签中，优先使用现有标签
   - 如果新内容引入了现有标签体系中没有的新领域或概念，再创建新的标签
4. 每个标签必须对应目录结构中的实际内容，不要创建没有对应内容支持的空标签
5. 确保修订后的领域树仍然符合良好的层次结构，标签间具有合理的父子关系

## 限制
1. 一级领域标签数量5-10个
2. 二级领域标签数量1-10个
3. 最多两层分类层级
4. 分类必须与原始目录内容相关
5. 输出必须符合指定 JSON 格式，不要输出 JSON 外其他任何不相关内容
6. 标签的名字最多不要超过 6 个字
7. 在每个标签前加入序号（序号不计入字数）

## 输出格式
最终输出修订后的完整领域树结构，使用下面的JSON格式：

\`\`\`json
[
  {
    "label": "1 一级领域标签",
    "child": [
      {"label": "1.1 二级领域标签1"},
      {"label": "1.2 二级领域标签2"}
    ]
  },
  {
    "label": "2 一级领域标签(无子标签)"
  }
]
\`\`\`

确保你的回答中只包含JSON格式的领域树，不要有其他解释性文字。`;

export const LABEL_REVISE_PROMPT_EN = `
I need your help to revise an existing domain tree structure to adapt to content changes.

## Existing Domain Tree Structure
Here is the current domain tree structure (JSON format):
{{existingTags}}

{{deletedContent}}

{{newContent}}

## All Existing Literature TOC
Below is an overview of the table of contents from all current literature in the system:
{{text}}

Please analyze the above information and revise the existing domain tree structure according to the following principles:
1. Maintain the overall structure of the domain tree, avoiding large-scale reconstruction
2. For domain tags related to deleted content:
   - If a tag is only related to the deleted content and no supporting content can be found in the existing literature, remove the tag
   - If a tag is also related to other retained content, keep the tag
3. For newly added content:
   - If new content can be classified into existing tags, prioritize using existing tags
   - If new content introduces new domains or concepts not present in the existing tag system, create new tags
4. Each tag must correspond to actual content in the table of contents, do not create empty tags without corresponding content support
5. Ensure that the revised domain tree still has a good hierarchical structure with reasonable parent-child relationships between tags

## Constraints
1. The number of primary domain labels should be between 5 and 10.
2. The number of secondary domain labels ≤ 5 per primary label.
3. There should be at most two classification levels.
4. The classification must be relevant to the original catalog content.
5. The output must conform to the specified JSON format.
6. The names of the labels should not exceed 6 characters.
7. Do not output any content other than the JSON.
8. Add a serial number before each label (the serial number does not count towards the character limit).

Output the complete revised domain tree structure using the JSON format below:

\`\`\`json
[
  {
    "label": "1 Primary Domain Label",
    "child": [
      {"label": "1.1 Secondary Domain Label 1"},
      {"label": "1.2 Secondary Domain Label 2"}
    ]
  },
  {
    "label": "2 Primary Domain Label (No Sub - labels)"
  }
]
\`\`\`

Ensure that your answer only contains the domain tree in JSON format without any explanatory text.`;

export function getLabelRevisePrompt(language, { text, existingTags, deletedContent, newContent }) {
  const prompt = language === 'en' ? LABEL_REVISE_PROMPT_EN : LABEL_REVISE_PROMPT;
  let deletedContentText = '';
  let newContentText = '';

  if (deletedContent) {
    deletedContentText =
      language === 'en'
        ? `## Deleted Content \n Here are the table of contents from the deleted literature:\n ${deletedContent}`
        : `## 被删除的内容 \n 以下是本次要删除的文献目录信息：\n ${deletedContent}`;
  }

  if (newContent) {
    newContentText =
      language === 'en'
        ? `## New Content \n Here are the table of contents from the newly added literature:\n ${newContent}`
        : `## 新增的内容 \n 以下是本次新增的文献目录信息：\n ${newContent}`;
  }

  const result = prompt
    .replaceAll('{{existingTags}}', JSON.stringify(existingTags, null, 2))
    .replaceAll('{{text}}', text)
    .replaceAll('{{deletedContent}}', deletedContentText)
    .replaceAll('{{newContent}}', newContentText);
  console.log(999, result);
  return result;
}
