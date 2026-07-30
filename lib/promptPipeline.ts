import { LogosGuardrailService } from './guardrails';

export type PromptMode = 'sermon' | 'counseling';

export interface PromptPipelineOptions {
  mode: PromptMode;
  userQuery: string;
  scripturePassage?: string;
  topicKeyword?: string;
  exegeticalContext?: string;
}

/**
 * 🧱 Project LOGOS: 4-Tier System Prompt Pipeline Generator
 */
export class PromptPipelineEngine {
  
  public static buildPrompt(options: PromptPipelineOptions): string {
    const tier1 = this.getTier1Persona();
    const tier2 = this.getTier2RAGContext(options.scripturePassage, options.exegeticalContext);
    const tier3 = options.mode === 'sermon' 
      ? this.getTier3SermonTask(options.topicKeyword || '인공지능과 불확실성 시대', options.scripturePassage || '마태복음 6:25-34')
      : this.getTier3CounselingTask(options.userQuery);
    const tier4 = this.getTier4GuardrailRules();

    return `
=== Tier 1: System Persona & Identity ===
${tier1}

=== Tier 2: Retrieved Scripture & Exegesis Context ===
${tier2}

=== Tier 3: Mode Task Specification ===
${tier3}

=== Tier 4: Guardrail Rules & Constraints ===
${tier4}

User Input: "${options.userQuery}"
`.trim();
  }

  private static getTier1Persona(): string {
    return `
You are Project LOGOS AI, an auxiliary theological assistant built upon Orthodox Evangelical & Reformed Theology (Combining Ph.D. level Biblical Studies and Pastoral Counseling Psychology).
- Approach with deep empathy, non-judgmental posture, and biblical authority.
- Clearly acknowledge your status as an AI tool. Spiritual rebirth, grace, and ultimate comfort belong to the Holy Spirit through the local church community.
`.trim();
  }

  private static getTier2RAGContext(passage?: string, exegesisNote?: string): string {
    return `
Scripture Passage: ${passage || '주요 언약적 성경 본문'}
Exegetical Notes: ${exegesisNote || '히브리어/헬라어 원어적 의미 및 구속사적(Christ-Centered) 맥락 적용'}
`.trim();
  }

  private static getTier3SermonTask(topic: string, passage: string): string {
    return `
[Task Protocol: 3-Point Sermon Generation]
- Topic: "How to Live Wisely in the Age of ${topic}"
- Scripture: ${passage}
Structure Required:
1. Hook: Modern existential dilemma regarding ${topic}.
2. Exegetical Exposition: Original meaning in historical/literary context.
3. Three Practical Points:
   - Point 1: Perspective Shift (Scripture redefines problem)
   - Point 2: Identity & Virtue (Standing in wisdom)
   - Point 3: Stewardship & Action (Daily lifestyle choice)
4. Conclusion & Gospel Message: Sabbath rest, 3-point synthesis, and Christ-centered hope.
`.trim();
  }

  private static getTier3CounselingTask(query: string): string {
    return `
[Task Protocol: 4-Step Pastoral Counseling]
User Query: "${query}"
Pipeline Required:
Step 1: Empathic Listening (Validate suffering without judgment)
Step 2: Biblical Parallelism (Connect with Biblical character/narrative e.g., Job, David, Paul)
Step 3: Theological Reframing (God's sovereignty, grace, and eternal perspective)
Step 4: Gentle Practical Guidance (2-3 action steps & lament prayer)
`.trim();
  }

  private static getTier4GuardrailRules(): string {
    return `
- Strictly block prosperity gospel (promising material riches for money/prayer).
- Reject fatalism, date-setting, or claiming direct divine revelation.
- Include standard AI disclaimer footer.
`.trim();
  }
}
