import type { Concept, FusionPatternId, FusionResult, Mode } from '@/types'

type PatternFn = (a: Concept, b: Concept, mode: Mode) => FusionResult

function pick<T>(arr: T[], fallback: T): T {
  return arr.length > 0 ? arr[0] : fallback
}

function stem(word: string): string {
  // Simple stem: remove common suffixes for title generation
  return word.replace(/する$|の$|的$|感$/, '')
}

const modeSuffix: Record<Mode, string[]> = {
  '真面目発明': ['システム', '装置', 'ソリューション', 'プラットフォーム'],
  '変な発明': ['マシン', 'フィルター', '工場', 'エンジン'],
  '創作ドリブン': ['ジェネレーター', 'ラボ', 'エンジン', 'オラクル'],
  'カリスモード': ['砲', '装置', '機関', '炉'],
}

function suffix(mode: Mode, idx = 0): string {
  const s = modeSuffix[mode]
  return s[idx % s.length]
}

// 1. 機能移植: A の用途を B の対象に移植
const funcTransfer: PatternFn = (a, b, mode) => {
  const func = pick(a.attributes.用途, a.raw)
  const target = pick(b.attributes.対象, b.raw)
  const title = `${stem(a.raw)}${stem(b.raw)}${suffix(mode)}`
  return {
    pattern: '機能移植',
    title,
    catchcopy: `${b.raw}に${a.raw}の力を宿す`,
    description: `${b.raw}の${target}に${a.raw}の「${func}」機能を移植した装置。${a.raw}が持つ本来の効果を${b.raw}の文脈で再定義することで、これまでにない体験を生み出す。`,
    problemSolved: `${b.raw}における${target}の${func}が不十分だった問題を解決する`,
    targetUsers: `${b.raw}に関わる人・${a.raw}を日常的に使う人`,
    sourceConcepts: [a.raw, b.raw],
  }
}

// 2. 状態連動: A の状態変化が B の条件をトリガー
const stateLinkage: PatternFn = (a, b, mode) => {
  const stateA = pick(a.attributes.状態変化, `${a.raw}の変化`)
  const stateB = pick(b.attributes.状態変化, `${b.raw}の変化`)
  const title = `${stateA.replace(/[^\u3040-\u9FFF]/g, '')}連動型${stem(b.raw)}${suffix(mode, 1)}`
  return {
    pattern: '状態連動',
    title,
    catchcopy: `${a.raw}が${stateA}するとき、${b.raw}は動き出す`,
    description: `${a.raw}の「${stateA}」という状態変化をセンシングし、自動的に${b.raw}の「${stateB}」を引き起こすシステム。二つの現象が意外な因果関係で結ばれることで、新しい行動設計が生まれる。`,
    problemSolved: `${b.raw}の${stateB}タイミングを人間が判断する負荷を${a.raw}の状態に委ねることで自動化する`,
    targetUsers: `${a.raw}を頻繁に経験する人・${b.raw}の${stateB}を最適化したい人`,
    sourceConcepts: [a.raw, b.raw],
  }
}

// 3. 目的転流: A の目的を B のドメインで運用
const purposeRedirect: PatternFn = (a, b, mode) => {
  const purposeA = pick(a.attributes.用途, `${a.raw}の目的`)
  const imgB = pick(b.attributes.周辺イメージ, b.raw)
  const title = `${stem(b.raw)}専用${stem(a.raw)}${suffix(mode, 2)}`
  return {
    pattern: '目的転流',
    title,
    catchcopy: `${a.raw}の哲学を${b.raw}の世界に流し込む`,
    description: `${a.raw}が本来目指す「${purposeA}」という目的を、${b.raw}の領域で再適用する。${imgB}のような環境の中で${a.raw}の論理が働くとき、全く新しい価値が生まれる。`,
    problemSolved: `${b.raw}の世界で${purposeA}という目的が果たされていない空白を埋める`,
    targetUsers: `${a.raw}と${b.raw}両方に関心を持つ人・${b.raw}の効率を求める人`,
    sourceConcepts: [a.raw, b.raw],
  }
}

// 4. 物理化: A の感情的特徴を B の物理特徴で具現化
const materialize: PatternFn = (a, b, mode) => {
  const emotionA = pick(a.attributes.感情的特徴, `${a.raw}の感覚`)
  const physB = pick(b.attributes.物理的特徴, `${b.raw}の形態`)
  const title = `${stem(a.raw)}物質化${stem(b.raw)}${suffix(mode)}`
  return {
    pattern: '物理化',
    title,
    catchcopy: `${emotionA}を${physB}に変換する装置`,
    description: `抽象的な${a.raw}が持つ「${emotionA}」という感覚を、${b.raw}の物理特性「${physB}」として可視化・触知可能にする。見えないものを形にすることで、理解と共有が可能になる。`,
    problemSolved: `${a.raw}の${emotionA}が他者に伝わらない問題を物理的インターフェースで解決する`,
    targetUsers: `${a.raw}を深く体験したい人・${b.raw}の物理特性に興味がある人`,
    sourceConcepts: [a.raw, b.raw],
  }
}

// 5. 本人化: A を生命体として扱い B の環境に配置
const personify: PatternFn = (a, b, mode) => {
  const paradoxA = pick(a.attributes.逆説性, `${a.raw}は矛盾を抱える`)
  const imgB = pick(b.attributes.周辺イメージ, b.raw)
  const title = `生きている${stem(a.raw)}×${stem(b.raw)}${suffix(mode, 2)}`
  return {
    pattern: '本人化',
    title,
    catchcopy: `${a.raw}が自分の意思で${b.raw}の中を生きる`,
    description: `${a.raw}を自律した生命体として扱い、${b.raw}という環境に放つ。${paradoxA}という矛盾を抱えながら${imgB}の世界を渡り歩く存在を想像することで、両者の本質が浮かび上がる。`,
    problemSolved: `${a.raw}の本質を受動的に観察するだけでなく、${b.raw}との相互作用を通じて能動的に理解する`,
    targetUsers: `${a.raw}や${b.raw}を新しい視点で捉えたいクリエイター・研究者`,
    sourceConcepts: [a.raw, b.raw],
  }
}

// 6. 取引化: A の行為を B を通貨とした取引に
const transactionalize: PatternFn = (a, b, mode) => {
  const funcA = pick(a.attributes.用途, a.raw)
  const emotionB = pick(b.attributes.感情的特徴, b.raw)
  const title = `${stem(b.raw)}決済${stem(a.raw)}${suffix(mode, 1)}`
  return {
    pattern: '取引化',
    title,
    catchcopy: `${a.raw}を${b.raw}で買う市場`,
    description: `${a.raw}における「${funcA}」行為を、${b.raw}の${emotionB}を通貨として取引するプラットフォーム。日常の行為に経済的フレームをかぶせることで、見落とされていた価値が可視化される。`,
    problemSolved: `${a.raw}の${funcA}が適切に評価されない問題を${b.raw}ベースの取引構造で解決する`,
    targetUsers: `${a.raw}の価値を認めてほしい人・${b.raw}の${emotionB}を持て余している人`,
    sourceConcepts: [a.raw, b.raw],
  }
}

// 7. 制約追加: B の制約を A の用途に課して逆説的価値を生む
const addConstraint: PatternFn = (a, b, mode) => {
  const constraintB = pick(b.attributes.制約, `${b.raw}の制限`)
  const funcA = pick(a.attributes.用途, a.raw)
  const title = `${constraintB.slice(0, 4)}限定${stem(a.raw)}${suffix(mode)}`
  return {
    pattern: '制約追加',
    title,
    catchcopy: `「${constraintB}」という縛りが${a.raw}を解放する`,
    description: `${b.raw}が持つ制約「${constraintB}」を${a.raw}の「${funcA}」に課すことで、逆説的な価値を生む。制限されるほど本質が際立ち、用途の再定義につながる。`,
    problemSolved: `${a.raw}の${funcA}が汎用化しすぎて個性を失っている問題を制約で逆転する`,
    targetUsers: `${a.raw}に新鮮さを求める人・${b.raw}の制約に慣れた人`,
    sourceConcepts: [a.raw, b.raw],
  }
}

// 8. 反転: A の逆説性を強みに転換し B で実現
const invert: PatternFn = (a, b, mode) => {
  const paradoxA = pick(a.attributes.逆説性, `${a.raw}の弱点`)
  const funcB = pick(b.attributes.functions_emotions, b.raw)
  const title = `逆説${stem(a.raw)}${stem(b.raw)}${suffix(mode, 3)}`
  return {
    pattern: '反転',
    title,
    catchcopy: `弱点こそが最大の武器。${a.raw}の矛盾を${b.raw}で武装する`,
    description: `「${paradoxA}」という${a.raw}の逆説・弱点を強みとして再定義し、${b.raw}の「${funcB}」を活用して実装する。欠点の中に潜む可能性を引き出すことで、既存の常識を覆す発明が生まれる。`,
    problemSolved: `${a.raw}の${paradoxA}が障害になっていた問題を根本から反転させる`,
    targetUsers: `${a.raw}の常識に違和感を感じていた人・${b.raw}を逆用したい人`,
    sourceConcepts: [a.raw, b.raw],
  }
}

export const fusionPatterns: Record<FusionPatternId, PatternFn> = {
  機能移植: funcTransfer,
  状態連動: stateLinkage,
  目的転流: purposeRedirect,
  物理化: materialize,
  本人化: personify,
  取引化: transactionalize,
  制約追加: addConstraint,
  反転: invert,
}

export const ALL_PATTERN_IDS: FusionPatternId[] = [
  '機能移植', '状態連動', '目的転流', '物理化',
  '本人化', '取引化', '制約追加', '反転',
]

export const MODE_PREFERRED_PATTERNS: Record<Mode, FusionPatternId[]> = {
  '真面目発明': ['機能移植', '状態連動', '目的転流', '制約追加'],
  '変な発明': ['物理化', '本人化', '反転', '制約追加'],
  '創作ドリブン': ['本人化', '目的転流', '物理化', '状態連動'],
  'カリスモード': ['反転', '取引化', '物理化', '本人化'],
}
