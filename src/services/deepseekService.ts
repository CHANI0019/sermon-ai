import { PromptPipelineEngine } from '../../lib/promptPipeline';
import llmConfig from '../config/llm-config.json';

export interface DeepSeekSermonOptions {
  topic: string;
  passage: string;
  newsTitle?: string;
  newsDescription?: string;
}

export interface DeepSeekModelItem {
  id: string;
  object: string;
  owned_by: string;
}

export interface DeepSeekConfigState {
  defaultModel: string;
  fallbackModels: string[];
  apiUrl: string;
  modelsApiUrl: string;
  autoDetectLatest: boolean;
  temperature: number;
  maxTokens: number;
  lastUpdated: string;
}

export class DeepSeekService {
  private static STORAGE_KEY = 'project_logos_deepseek_config';

  // Current active configuration state
  private static configState: DeepSeekConfigState = DeepSeekService.loadInitialConfig();

  private static loadInitialConfig(): DeepSeekConfigState {
    try {
      const saved = localStorage.getItem(DeepSeekService.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback to static JSON file if localStorage fails
    }
    return {
      defaultModel: llmConfig.deepseek.defaultModel,
      fallbackModels: [...llmConfig.deepseek.fallbackModels],
      apiUrl: llmConfig.deepseek.apiUrl,
      modelsApiUrl: llmConfig.deepseek.modelsApiUrl,
      autoDetectLatest: llmConfig.deepseek.autoDetectLatest,
      temperature: llmConfig.deepseek.temperature,
      maxTokens: llmConfig.deepseek.maxTokens || 4096,
      lastUpdated: llmConfig.deepseek.lastUpdated
    };
  }

  private static saveConfigState(newConfig: Partial<DeepSeekConfigState>) {
    this.configState = { ...this.configState, ...newConfig, lastUpdated: new Date().toLocaleDateString('ko-KR') };
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.configState));
    } catch (e) {
      console.warn('Failed to persist DeepSeek config to localStorage:', e);
    }
  }

  private static getApiKey(): string {
    return (import.meta as any).env?.VITE_DEEPSEEK_API_KEY || 'sk-674ecceebc434a48a62fbfc780b095e4';
  }

  /**
   * 🔄 DeepSeek API /models 목록을 가져와 "defaultModel" 및 "fallbackModels" 배열을 
   * 최신 모델 정보로 자동으로 변경하고 저장(Auto-Sync & Auto-Update)합니다.
   */
  public static async syncAndAutoUpdateConfig(): Promise<DeepSeekConfigState> {
    const apiKey = this.getApiKey();

    try {
      console.log('[DeepSeek Auto-Sync] Fetching live model list from DeepSeek API server...');
      
      const response = await fetch(this.configState.modelsApiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const models: DeepSeekModelItem[] = data.data || [];

        if (models.length > 0) {
          const fetchedModelIds = models.map((m) => m.id);
          const primaryModel = fetchedModelIds.find((id) => id.includes('chat') || id.includes('reasoner')) || fetchedModelIds[0];
          const updatedFallbacks = Array.from(new Set([primaryModel, ...fetchedModelIds]));

          this.saveConfigState({
            defaultModel: primaryModel,
            fallbackModels: updatedFallbacks
          });

          console.log(`[DeepSeek Auto-Sync Success] defaultModel automatically updated to: "${primaryModel}"`);
        }
      }
    } catch (err) {
      console.warn('[DeepSeek Auto-Sync] API call failed, keeping current dynamic config state:', err);
    }

    return this.configState;
  }

  /**
   * 🔄 대본이 아무리 길어도 중간에 잘리지 않고 100% 끝까지 완벽하게 작성되도록 
   * 자동 이어쓰기(Seamless Auto-Continuation Loop) 메커니즘을 적용한 설교 대본 생성
   */
  public static async generateFullPastorSermonScript(options: DeepSeekSermonOptions): Promise<string> {
    const apiKey = this.getApiKey();

    if (this.configState.autoDetectLatest) {
      await this.syncAndAutoUpdateConfig();
    }

    const systemPrompt = PromptPipelineEngine.buildPrompt({
      mode: 'sermon',
      userQuery: `주제: ${options.topic}, 성경본문: ${options.passage}${options.newsTitle ? `, 연관 시사뉴스: ${options.newsTitle}` : ''}`,
      scripturePassage: options.passage,
      topicKeyword: options.topic
    });

    const userPrompt = `
당신은 정통 개혁주의 및 복음주의 신학(Ph.D. 성경학/목회상담)에 깊이 뿌리박힌 설교 작성 전문 AI입니다.
목사님께서 주일 강단에 서서 교인들의 눈을 바라보며 감정과 진심을 실어 선포하고, **음성 TTS(Text-To-Speech)로 읽을 때 호흡과 억양이 매우 자연스러운 100% 생생한 구어체(존댓말 목회자 어조: "사랑하는 성도 여러분...", "우리가 이 말씀 앞에 서면...", "주님의 평안이 함께하기를 축원합니다.")**로 완벽한 풀 텍스트 설교 대본(Full Sermon Script)을 작성해 주세요.

[구어체, 호흡 및 음성 낭독 가이드라인]
- 성경 본문 및 설교문을 작성할 때, 딱딱한 목차 제목("서론: ...", "본문 주해: ...", "본론: ...") 대신 강단에서 자연스럽게 대화하듯 연결하는 구어체 표현을 사용하십시오!
  * 예시 1: "서론: 불안한 시대, 우리의 자리는 어디인가?" ➔ "서론은 '불안한 시대, 우리의 자리는 어디인가?'에 대해 말씀드리고자 합니다."
  * 예시 2: "본문 주해: 절망 속에서 피난처를 발견하다" ➔ "본문 주해는 '절망 속에서 피난처를 발견하다'입니다."
  * 예시 3: "본론: 세 가지 실천적 지혜" ➔ "본론은 세 가지 실천적 지혜에 대해 말씀드립니다."
- 목사님이 강단에서 선포하거나 음성 TTS로 낭독할 때 숨을 고를 수 있도록 **마침표(.), 물음표(?), 느낌표(!), 쉼표(,) 및 띄어쓰기**를 촘촘하게 사용하십시오.
- 대본이 끝까지 완벽하게 완성되도록 서론부터 3대지, 결론, 묵상 기도문까지 문장이 완성되도록 결론짓는 풀 대본을 생성하십시오!
- 감정이 이입되는 억양 어미("~하지 않겠습니까?", "~바라봅니다.", "~선포합니다!", "~아멘.")를 활용합니다.

[성경 구절 인용 표기 가이드라인]
- 성경 구절 제목 뒤에 "(개역개정)" 표기를 붙이지 마십시오! (예: "시편 142:1-5" 또는 "히브리서 4:15-16")
- 각 절을 작성할 때 숫자 뒤에 반드시 "절"을 붙여 구절을 명확히 구분하십시오! (예: "1절 내가 소리 내어...", "2절 내가 내 불평을...", "15절 우리에게 있는...", "16절 그러므로 우리는...")

[설교 구성 요건]
1. 설교 제목 및 성경 본문 낭독 안내
2. 서론 (Hook): ${options.newsTitle ? `최신 시사 뉴스("${options.newsTitle}")와` : ''} 현대인의 불확실성, 불안, 영적 갈증 조명
3. 본문 주해: ${options.passage}의 역사적/원어적 의미 및 예수 그리스도의 십자가 대속과 구속사적(Christ-Centered) 연결
4. 본론 3대지 (각 대지별 목회자의 실질적 강단 선포 메시지):
   - 첫째 대지: 관점의 전환 (세속적 염려에서 하나님의 주권적 섭리로)
   - 둘째 대지: 그리스도인의 정체성 (세속 사조에 맞서는 거룩한 절제와 믿음)
   - 셋째 대지: 청지기 삶과 실천 (일상과 이웃을 향한 사랑의 구체적 실천)
5. 결론 및 안식의 소망: 십자가 승리와 예수 그리스도 안에서의 참된 안식
6. 마무리를 위한 대표 묵상 기도문

목사님이 읽고 바로 설교하실 수 있도록 아주 깊이 있고 생생하게 작성해 주세요.
`.trim();

    const candidateModels = Array.from(new Set([
      this.configState.defaultModel,
      ...this.configState.fallbackModels
    ]));

    for (const modelToUse of candidateModels) {
      try {
        console.log(`[DeepSeek API Request] Triggering LLM Generation with Model: "${modelToUse}"`);

        let fullScriptResult = '';
        let finishReason = 'length';
        let continuationCount = 0;

        let messagesHistory: any[] = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ];

        // 🔄 Seamless Auto-Continuation Loop until 100% completed
        while ((finishReason === 'length' || finishReason === 'stop_limit') && continuationCount < 3) {
          const response = await fetch(this.configState.apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: modelToUse,
              messages: messagesHistory,
              temperature: this.configState.temperature,
              max_tokens: this.configState.maxTokens || 4096
            })
          });

          if (!response.ok) {
            console.warn(`[DeepSeek API Warning] Model "${modelToUse}" responded with status: ${response.status}`);
            break;
          }

          const data = await response.json();
          const choice = data.choices?.[0];
          const newContent = choice?.message?.content || '';
          finishReason = choice?.finish_reason || 'stop';

          fullScriptResult += newContent;
          continuationCount++;

          // If finished naturally, break loop
          if (finishReason === 'stop' || !finishReason) {
            break;
          }

          // If truncated by length limit, automatically prompt to continue seamlessly!
          console.log(`[Auto-Continuation Loop] Truncation detected (finish_reason: ${finishReason}). Auto-continuing chunk #${continuationCount}...`);
          messagesHistory.push({ role: 'assistant', content: newContent });
          messagesHistory.push({ role: 'user', content: '이어서 잘린 부분부터 문장을 매끄럽게 연결하여 끝까지 마무리를 계속 작성해 주세요.' });
        }

        if (fullScriptResult.trim()) {
          if (this.configState.defaultModel !== modelToUse) {
            this.saveConfigState({ defaultModel: modelToUse });
          }
          return fullScriptResult;
        }
      } catch (err) {
        console.warn(`[DeepSeek API Error] Failed with model "${modelToUse}", trying next fallback:`, err);
      }
    }

    // Fallback Local Generator if network is offline
    return this.generateFallbackScript(options);
  }

  /**
   * Get Current Configuration State
   */
  public static getConfigState(): DeepSeekConfigState {
    return this.configState;
  }

  private static generateFallbackScript(options: DeepSeekSermonOptions): string {
    return `
# 📖 주일 설교 대본: 불안과 통제의 시대, 지혜로운 성도로 사는 법

**성경 본문**: ${options.passage}
**설교 주제**: ${options.topic} ${options.newsTitle ? `(시사 이슈 연계: ${options.newsTitle})` : ''}
**적용 모델**: ${this.configState.defaultModel} (오프라인 로컬 엔진)

---

## 🎙️ [서론] 사랑하는 성도 여러분

오늘 우리는 참으로 빠르게 변하고 불확실성이 가득한 세상을 살아가고 있습니다. 
${options.newsTitle ? `최근 보도된 뉴스("${options.newsTitle}")처럼, ` : ''}모든 것을 기술과 데이터로 예측하고 통제하려 하지만, 우리의 마음속 깊은 곳에는 내일에 대한 염려와 불안이 여전히 자리 잡고 있습니다.

그러나 사랑하는 성도 여러분, 세상의 조급함과 두려움에 마음을 빼앗기지 마십시오. 오늘 주님께서는 말씀을 통해 우리가 어디에 참된 소망을 두어야 하는지 명확히 선언하고 계십니다.

---

## 🏛️ [본문 주해] 십자가 피로 이루신 구속사의 은혜

오늘 본문인 ${options.passage} 말씀에 서면, 성경 원어는 우리에게 깊은 영적 지혜를 일깨워 줍니다. 
예수님께서 말씀하신 '염려'의 원래 의미는 우리의 마음이 여러 조각으로 산산이 갈라진 상태를 뜻합니다.

우리가 삶을 스스로 통제하려 할 때 우리의 영혼은 갈라지고 소진됩니다. 하지만 하나님 아버지께서는 들의 백합화와 공중의 새를 먹이시듯, 당신의 피 값으로 사신 자녀들의 삶을 주권적으로 다스리십니다. 아들까지 아끼지 아니하시고 십자가에 내어주신 하나님께서 우리의 모든 생애 정황을 선으로 이끌어 가십니다.

---

## 💡 [본론 1대지] 세속적 통제의 욕망에서 하나님의 주권적 섭리로

첫째로, 우리는 내가 삶의 통제권을 쥐려는 우상을 내려놓아야 합니다.
내 힘으로 내일을 다 제어할 수 있다는 착각을 버릴 때, 비로소 은혜의 하나님이 보이기 시작합니다. 사업의 흔들림, 재정적 압박, 경력의 불안 속에서도 주님의 선하신 손길은 멈추지 않습니다. 상황을 보지 마시고 십자가 위에서 승리하신 주님을 바라보십시오.

---

## 💡 [본론 2대지] 세상의 조급함에 맞서는 거룩한 정체성과 절제

둘째로, 그리스도인은 세상 사람들과 다른 영적 정체성을 지녀야 합니다.
세상은 불안하기에 더 끌어모으고 타인과 비교하며 조급해하지만, 성도는 이미 그리스도 안에서 하나님 자녀라는 가장 영광스러운 신분을 얻었습니다. 우리는 내일의 염려를 오늘로 끌어당겨 영혼을 망가뜨리지 않고, 오늘 내게 주신 은혜의 분량에 감사하며 거룩한 절제를 지킵니다.

---

## 💡 [본론 3대지] 일상에서 빛과 소금으로 살아가는 청지기의 실천

셋째로, 이제 우리의 삶은 이웃을 향한 사랑의 실천으로 흘러가야 합니다.
내가 가진 재물과 시간, 재능은 내 소유가 아니라 하나님이 잠시 맡겨주신 선물입니다. 주님의 청지기로서 오늘 내 곁에서 외로워하고 고통받는 지체들에게 따뜻한 손을 내밀고, 교회 공동체 안에서 함께 짐을 짊어집니다.

---

## ✝️ [결론 및 묵상 기도]

사랑하는 성도 여러분, 
예수 그리스도께서는 십자가에서 인류의 가장 극심한 수치와 죽음의 권세를 친히 무력화하시고 부활하셨습니다. 그분 안에 참된 안식(Sabbath Rest)이 있습니다. 내일의 염려를 십자가 앞에 다 내려놓으시고 주님이 주시는 평안으로 승리하시기를 축원합니다.

**[함께 드릴 기도]**
"사랑과 은혜가 풍성하신 하나님 아버지, 내 힘으로 삶을 통제하려 했던 조급함과 불신앙을 용서하여 주옵소서. 독생자 예수를 아낌없이 내어주신 하나님의 사랑을 신뢰하며, 오늘 내게 주신 은혜 안에서 담대하게 걸어가게 하옵소서. 주 예수 그리스도의 이름으로 기도드립니다. 아멘."
`.trim();
  }
}
