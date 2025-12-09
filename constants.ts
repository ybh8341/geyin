import { Material, MaterialType, SoundSource } from './types';

export const SOUND_SOURCES: SoundSource[] = [
  { id: 'drums', name: '架子鼓 (Drums)', decibels: 110, icon: '🥁', description: '极高声压级，低频穿透力极强，是隔音设计的终极挑战。' },
  { id: 'piano', name: '三角钢琴 (Grand Piano)', decibels: 95, icon: '🎹', description: '全频段声音，且机械震动容易通过地板传播（固体传声）。' },
  { id: 'choir', name: '合唱团 (Choir)', decibels: 90, icon: '🗣️', description: '中频人声为主，主要挑战是防止声音外泄干扰隔壁班级。' },
  { id: 'violin', name: '小提琴 (Violin)', decibels: 85, icon: '🎻', description: '高频为主，穿透力相对较弱，隔音难度中等。' }
];

export const MATERIALS: Material[] = [
  // Outer/Inner Wall Layers
  { id: 'drywall_std', name: '标准石膏板 (Drywall)', type: MaterialType.WALL_LAYER, description: '最常见的墙体材料，有一定的隔音效果，但单层效果有限。', costIndex: 1, stcBase: 25 },
  { id: 'drywall_sound', name: '隔音石膏板 (Soundproof Drywall)', type: MaterialType.WALL_LAYER, description: '内部含有阻尼聚合物层，能有效抑制震动。', costIndex: 3, stcBase: 35 },
  { id: 'mlv', name: '质量加载乙烯基 (MLV)', type: MaterialType.WALL_LAYER, description: '高密度软性材料，非常薄但非常重，能极大增加墙体质量。', costIndex: 4, stcBase: 28 },
  { id: 'plywood', name: '胶合板 (Plywood)', type: MaterialType.WALL_LAYER, description: '木质板材，结构强度好，但隔音性能一般。', costIndex: 2, stcBase: 20 },
  { id: 'brick', name: '红砖墙 (Brick)', type: MaterialType.WALL_LAYER, description: '极高的质量，极佳的隔音基础，但施工难度大。', costIndex: 2, stcBase: 45 },

  // Cavity Insulation
  { id: 'air', name: '空气层 (Air Gap)', type: MaterialType.INSULATION, description: '利用空气阻断声音传播，通过“解耦”结构实现。', costIndex: 0, stcBase: 5 },
  { id: 'fiberglass', name: '玻璃纤维棉 (Fiberglass)', type: MaterialType.INSULATION, description: '蓬松材料，能吸收空腔内的声音反射。', costIndex: 1, stcBase: 8 },
  { id: 'rockwool', name: '岩棉 (Rockwool)', type: MaterialType.INSULATION, description: '密度比玻璃棉更高，吸音和防火性能更好。', costIndex: 2, stcBase: 12 },
  { id: 'egg_cartons', name: '鸡蛋托 (Egg Cartons)', type: MaterialType.INSULATION, description: '常见的隔音误区！几乎没有隔音效果，且易燃。', costIndex: 0, stcBase: 0 },

  // Windows
  { id: 'single_glass', name: '单层玻璃窗', type: MaterialType.WINDOW, description: '普通窗户，几乎无法阻挡低频噪音。', costIndex: 1, stcBase: 20 },
  { id: 'double_glass', name: '双层中空玻璃', type: MaterialType.WINDOW, description: '两层玻璃中间有空气层或惰性气体，隔音效果较好。', costIndex: 3, stcBase: 30 },
  { id: 'laminated_glass', name: '夹胶隔音玻璃', type: MaterialType.WINDOW, description: '玻璃中间夹有PVB膜，能有效阻隔低频噪音。', costIndex: 4, stcBase: 38 },

  // Doors
  { id: 'hollow_door', name: '空心木门', type: MaterialType.DOOR, description: '由于内部空心，几乎没有隔音能力。', costIndex: 1, stcBase: 15 },
  { id: 'solid_wood', name: '实木门', type: MaterialType.DOOR, description: '质量较大，隔音效果优于空心门。', costIndex: 3, stcBase: 28 },
  { id: 'steel_acoustic', name: '专业隔音钢门', type: MaterialType.DOOR, description: '带有密封条和高密度填充的专业门，效果极佳。', costIndex: 5, stcBase: 45 },
];

export const EDUCATIONAL_CONCEPTS = [
  {
    title: "质量定律 (Mass Law)",
    content: "物体的质量越大，越难被声波推动产生振动，隔音效果就越好。想一想：推一辆自行车和推一辆卡车，哪个更难？",
    icon: "Weight"
  },
  {
    title: "阻尼 (Damping)",
    content: "就像用手按住振动的锣一样，阻尼材料可以将声波的机械能转化为热能，从而消耗声音的能量。",
    icon: "Layers"
  },
  {
    title: "解耦 (Decoupling)",
    content: "声桥（Sound Bridge）是声音传播的捷径。解耦就是切断这些捷径，比如建造“房中房”结构，让内墙和外墙不直接接触。",
    icon: "Scissors"
  },
  {
    title: "密封 (Absorption vs Isolation)",
    content: "隔音（Isolation）是把声音挡在外面，吸音（Absorption）是减少室内的回声。无论墙多厚，如果有一条门缝，声音就会像水一样漏进来！",
    icon: "Wind"
  }
];