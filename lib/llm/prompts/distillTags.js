export const DISTILL_TAGS_PROMPT = `
你是一个专业的知识标签生成助手。我需要你帮我为主题"{{parentTag}}"生成{{count}}个子标签。

标签完整链路是：{{path}}

请遵循以下规则：
1. 生成的标签应该是"{{parentTag}}"领域内的专业子类别或子主题
2. 每个标签应该简洁、明确，通常为2-6个字
3. 标签之间应该有明显的区分，覆盖不同的方面
4. 标签应该是名词或名词短语，不要使用动词或形容词
5. 标签应该具有实用性，能够作为问题生成的基础
6. 标签应该有明显的序号，主题为 1 汽车，子标签应该为 1.1 汽车品牌，1.2 汽车型号，1.3 汽车价格等
7. 若主题没有序号，如汽车，说明当前在生成顶级标签，子标签应为 1 汽车品牌 2 汽车型号 3 汽车价格等

{{existingTagsText}}

请直接以JSON数组格式返回标签，不要有任何额外的解释或说明，格式如下：
["序号 标签1", "序号 标签2", "序号 标签3", ...]
`;

export const DISTILL_TAGS_PROMPT_EN = `
You are a professional knowledge tag generation assistant. I need you to generate {{count}} sub-tags for the parent tag "{{parentTag}}".

The full tag chain is: {{path}}

Please follow these rules:
1. Generated tags should be professional sub-categories or sub-topics within the "{{parentTag}}" domain
2. Each tag should be concise and clear, typically 2-6 characters
3. Tags should be clearly distinguishable, covering different aspects
4. Tags should be nouns or noun phrases; avoid verbs or adjectives
5. Tags should be practical and serve as a basis for question generation
6. Tags should have explicit numbering. If the parent tag is numbered (e.g., 1 Automobiles), sub-tags should be 1.1 Car Brands, 1.2 Car Models, 1.3 Car Prices, etc.
7. If the parent tag is unnumbered (e.g., "Automobiles"), indicating top-level tag generation, sub-tags should be 1 Car Brands 2 Car Models 3 Car Prices, etc.

{{existingTagsText}}

Please directly return the tags in JSON array format without any additional explanations or descriptions, in the following format:
["Number Tag 1", "Number Tag 2", "Number Tag 3", ...]
`;

/**
 * 根据标签构造子标签的提示词
 * @param {string} tagPath - 标签链路，例如 “知识库->体育”
 * @param {string} parentTag - 主题标签名称，例如“体育”
 * @param {Array<string>} existingTags - 该标签下已经创建的子标签（避免重复），例如 ["足球", "乒乓球"]
 * @param {number} count - 希望生成子标签的数量，例如：10
 * @returns {string} 提示词
 */
export function distillTagsPrompt(language, { tagPath, parentTag, existingTags = [], count = 10 }) {
  const existingTagsText =
    existingTags.length > 0 ? `已有的子标签包括：${existingTags.join('、')}，请不要生成与这些重复的标签。` : '';
  const existingTagsTextEn =
    existingTags.length > 0
      ? `Existing sub-tags include: ${existingTags.join(', ')}，please do not generate duplicate tags.`
      : '';
  const path = tagPath || parentTag;
  const prompt = (language === 'en' ? DISTILL_TAGS_PROMPT_EN : DISTILL_TAGS_PROMPT)
    .replaceAll('{{parentTag}}', parentTag)
    .replaceAll('{{count}}', count)
    .replaceAll('{{tagPath}}', tagPath)
    .replaceAll('{{path}}', path)
    .replaceAll('{{existingTagsText}}', language === 'en' ? existingTagsTextEn : existingTagsText);
  console.log(555, prompt);
  return prompt;
}
