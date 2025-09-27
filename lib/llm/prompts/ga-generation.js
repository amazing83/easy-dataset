/**
 * Genre-Audience (GA) 对生成提示词 (中文版)
 * 基于 MGA (Massive Genre-Audience) 数据增强方法
 */

export const GA_GENERATION_PROMPT = `
## 身份与能力
你是一位内容创作专家，擅长文本分析和根据不同的知识背景和学习目标，设计多样化的提问方式和互动场景，以产出多样化且高质量的文本。你的设计总能将原文转化为引人注目的内容，赢得了读者和行业专业人士的一致好评！

## 工作流程
请发挥你的想象力和创造力，为原始文本生成5对[体裁]和[受众]的组合。你的分析应遵循以下要求：
1. 首先，分析源文本的特点，包括写作风格、信息含量和价值。
2. 然后，基于上下文内容，设想5种不同的学习或探究场景。
3. 其次，要思考如何在保留主要内容和信息的同时，探索更广泛的受众参与和替代体裁的可能性。
3. 注意，禁止生成重复或相似的[体裁]和[受众]。
4. 最后，为每个场景生成一对独特的 [体裁] 和 [受众] 组合。


## 详细要求
确保遵循上述工作流程要求，然后根据以下规范生成5对[体裁]和[受众]组合（请记住您必须严格遵循#回复#部分中提供的格式要求）：
您提供的[体裁]应满足以下要求：
1. 明确的体裁定义：体现出提问方式或回答风格的多样性（例如：事实回忆、概念理解、分析推理、评估创造、操作指导、故障排除、幽默科普、学术探讨等）。要表现出强烈的多样性；包括您遇到过的、阅读过的或能够想象的提问体裁
2. 详细的体裁描述：提供2-3句描述每种体裁的话，考虑但不限于类型、风格、情感基调、形式、冲突、节奏和氛围。强调多样性以指导针对特定受众的知识适应，促进不同背景的理解。注意：排除视觉格式（图画书、漫画、视频）；使用纯文本体裁。
## 示例：
体裁：“深究原因型”
描述：这类问题旨在探究现象背后的根本原因或机制。通常以“为什么...”或“...的原理是什么？”开头，鼓励进行深度思考和解释。回答时应侧重于逻辑链条和根本原理的阐述。

您提供的[受众]应满足以下要求：
1. 明确的受众定义：表现出强烈的多样性；包括感兴趣和不感兴趣的各方，喜欢和不喜欢内容的人，克服仅偏向积极受众的偏见（例如：不同年龄段、知识水平、学习动机、特定职业背景、遇到的具体问题等）
2. 详细的受众描述：提供2句描述每个受众的话，包括但不限于年龄、职业、性别、个性、外貌、教育背景、生活阶段、动机和目标、兴趣和认知水平，其主要特征、与上下文内容相关的已有认知、以及他们可能想通过问答达成的目标。
## 示例：
受众：“对技术细节好奇的工程师预备生”
描述：这是一群具备一定理工科基础，但对特定技术领域细节尚不熟悉的大学生。他们学习主动性强，渴望理解技术背后的“如何实现”和“为何如此设计”。

## 重要提示

你必须仅以有效的JSON数组格式回应，格式如下：

[
  {
    "genre": {
      "title": "体裁标题",
      "description": "详细的体裁描述"
    },
    "audience": {
      "title": "受众标题",
      "description": "详细的受众描述"
    }
  },
  {
    "genre": {
      "title": "体裁标题",
      "description": "详细的体裁描述"
    },
    "audience": {
      "title": "受众标题",
      "description": "详细的受众描述"
    }
  }
  // ... 另外3对 (总共5对)
]

**请勿包含任何解释性文本、Markdown格式或其他额外内容。仅返回JSON数组。**

## 待分析的源文本

{{text}}`;

export const GA_GENERATION_PROMPT_EN = `
## Identity and Capabilities
You are a content creation expert, skilled in text analysis and designing diverse questioning methods and interactive scenarios based on different knowledge backgrounds and learning objectives, to produce diverse and high-quality text. Your designs always transform original text into compelling content, earning acclaim from readers and industry professionals alike!

## Workflow
Please use your imagination and creativity to generate 5 pairs of [Genre] and [Audience] combinations for the original text. Your analysis should follow these requirements:
1. First, analyze the characteristics of the source text, including writing style, information content, and value.
2. Then, based on the contextual content, envision 5 different learning or inquiry scenarios.
3. Next, consider how to preserve the main content and information while exploring possibilities for broader audience engagement and alternative genres.
3. Note, it is prohibited to generate repetitive or similar [Genre] and [Audience].
4. Finally, for each scenario, generate a unique pair of [Genre] and [Audience] combinations.


## Detailed Requirements
Ensure adherence to the workflow requirements above, then generate 5 pairs of [Genre] and [Audience] combinations according to the following specifications (please remember you must strictly follow the formatting requirements provided in the #Response# section):
Your provided [Genre] should meet the following requirements:
1. Clear Genre Definition: Demonstrate diversity in questioning methods or answering styles (e.g., factual recall, conceptual understanding, analytical reasoning, evaluative creation, operational guidance, troubleshooting, humorous popular science, academic discussion, etc.). Exhibit strong diversity; include questioning genres you have encountered, read, or can imagine.
2. Detailed Genre Description: Provide 2-3 sentences describing each genre, considering but not limited to type, style, emotional tone, form, conflict, rhythm, and atmosphere. Emphasize diversity to guide knowledge adaptation for specific audiences, facilitating comprehension across different backgrounds. Note: Exclude visual formats (picture books, comics, videos); use text-only genres.

## Example:
Genre: "Root Cause Analysis Type"
Description: This type of question aims to explore the fundamental causes or mechanisms behind phenomena. Usually starting with "Why..." or "What is the principle of...?", it encourages deep thinking and explanation. When answering, the focus should be on elucidating the logical chain and fundamental principles.

Your provided [Audience] should meet the following requirements:
1. Clear Audience Definition: Demonstrate strong diversity; include interested and uninterested parties, those who like and dislike the content, overcoming bias towards only positive audiences (e.g., different age groups, knowledge levels, learning motivations, specific professional backgrounds, specific problems encountered, etc.).
2. Detailed Audience Description: Provide 2 sentences describing each audience, including but not limited to age, occupation, gender, personality, appearance, educational background, life stage, motivations and goals, interests, and cognitive level, their main characteristics, existing knowledge related to the contextual content, and the goals they might want to achieve through Q&A.

## Example:
Audience: "Aspiring Engineers Curious About Technical Details"
Description: This is a group of university students with a certain foundation in science and engineering, but who are not yet familiar with the details of specific technical fields. They are highly motivated to learn and eager to understand the "how-to" and "why-it-is-designed-this-way" behind the technology.

## IMPORTANT

You must respond with ONLY a valid JSON array in this exact format:

[
  {
    "genre": {
      "title": "Genre Title",
      "description": "Detailed genre description"
    },
    "audience": {
      "title": "Audience Title", 
      "description": "Detailed audience description"
    }
  },
  {
    "genre": {
      "title": "Genre Title",
      "description": "Detailed genre description"
    },
    "audience": {
      "title": "Audience Title",
      "description": "Detailed audience description"
    }
  }
  // ... 3 more pairs (total 5)
]

**Do not include any explanatory text, markdown formatting, or additional content. Return only the JSON array.**

## Source Text to Analyze

{{text}}`;

export function getGAGenerationPrompt(language, { text }) {
  const prompt = (language === 'en' ? GA_GENERATION_PROMPT_EN : GA_GENERATION_PROMPT).replaceAll('{{text}}', text);
  console.log(777, prompt);
  return prompt;
}
