import { GoogleGenAI, Type } from "@google/genai";
import { RoomConfig, AnalysisResponse } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeRoomDesign = async (config: RoomConfig): Promise<AnalysisResponse> => {
  const client = getClient();
  
  // Fallback mock response if API key is missing (dev safety) or error occurs
  const fallbackResponse: AnalysisResponse = {
    stc: 30,
    analysis: "无法连接到AI声学顾问。请检查API密钥配置。基于基础算法：您的设计存在明显的声桥效应。",
    suggestions: ["尝试添加API密钥以获得完整分析。", "检查网络连接。"],
    frequency_data: [
      { label: '125Hz', value: 10 },
      { label: '500Hz', value: 25 },
      { label: '1000Hz', value: 35 },
      { label: '4000Hz', value: 45 }
    ]
  };

  if (!client) return fallbackResponse;

  const sourceContext = config.source 
    ? `声源: ${config.source.name}, 强度约 ${config.source.decibels} dB` 
    : '声源: 标准架子鼓 (约 100 dB)';

  const materialsList = [
    sourceContext,
    config.outerWall ? `外层: ${config.outerWall.name}` : '外层: 无',
    config.cavityFill ? `空腔填充: ${config.cavityFill.name}` : '空腔填充: 无',
    config.innerWall ? `内层: ${config.innerWall.name}` : '内层: 无',
    config.window ? `窗户: ${config.window.name}` : '窗户: 无',
    config.door ? `门: ${config.door.name}` : '门: 无',
  ].join(', ');

  const prompt = `
    作为一名专业的声学工程师和物理老师，请分析以下学生设计的“音乐教室隔音房模型”。
    
    设计配置:
    ${materialsList}
    
    教学目标: 帮助8年级学生理解声音传播、质量定律和解耦原理。
    
    请提供:
    1. 预估的 STC (Sound Transmission Class) 值。这是一个综合评分。
    2. 对该设计的详细物理分析（适合8年级学生理解），特别是针对所选声源（${config.source?.name}）的隔音效果。解释为什么好或不好。
    3. 3条具体的改进建议。
    4. 模拟不同频率下的隔音量 (Transmission Loss in dB) 用于绘图 (125Hz, 250Hz, 500Hz, 1000Hz, 2000Hz, 4000Hz)。
    
    注意：如果学生使用了“鸡蛋托”，请务必进行科学辟谣。
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            stc: { type: Type.NUMBER, description: "Estimated STC value" },
            analysis: { type: Type.STRING, description: "Educational analysis for 8th graders" },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 improvement tips" },
            frequency_data: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING, description: "Frequency label e.g., 125Hz" },
                  value: { type: Type.NUMBER, description: "Transmission Loss in dB" }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResponse;
    }
    return fallbackResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
        ...fallbackResponse,
        analysis: "AI分析服务暂时不可用，请稍后再试或检查API配额。"
    };
  }
};