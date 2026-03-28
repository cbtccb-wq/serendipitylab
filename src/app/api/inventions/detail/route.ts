import { NextRequest, NextResponse } from 'next/server'
import type { InventionIdea } from '@/types'

export interface DetailExpansion {
  objective: string
  challenges: string[]
  requiredTech: string[]
  targetScenes: string[]
  businessModel: string
  risks: string[]
  nextSteps: string[]
}

export async function POST(request: NextRequest) {
  const body: { invention: InventionIdea } = await request.json()
  const inv = body.invention
  if (!inv?.title) {
    return NextResponse.json({ error: 'invention が必要です' }, { status: 400 })
  }

  // Rule-based expansion from invention attributes
  const detail: DetailExpansion = {
    objective: `${inv.sourceConcepts.join('と')}の融合によって「${inv.problemSolved}」を達成すること`,
    challenges: [
      `${inv.sourceConcepts[0]}の特性を${inv.sourceConcepts[1] ?? inv.sourceConcepts[0]}の文脈で機能させる技術的整合性`,
      `ユーザーが直感的に価値を理解できるUX設計`,
      `既存の代替手段との差別化の明確化`,
      inv.scores.feasibility <= 2
        ? '実現可能性が低いため、概念実証フェーズからの段階的アプローチが必要'
        : '初期コストの最小化と早期プロトタイプ検証',
    ],
    requiredTech: buildRequiredTech(inv),
    targetScenes: [
      `${inv.targetUsers}が${inv.sourceConcepts[0]}を扱う日常的な場面`,
      `既存の${inv.sourceConcepts[1] ?? inv.sourceConcepts[0]}関連サービスとの接点`,
      `新規体験として提示できる展示・デモ環境`,
    ],
    businessModel: buildBusinessModel(inv),
    risks: [
      inv.scores.weirdness >= 4
        ? '概念が前衛的すぎて市場受容に時間がかかる可能性'
        : '競合参入が容易なコモディティ化リスク',
      `${inv.sourceConcepts.join('と')}の両ドメインの専門知識が同時に必要`,
      '規制・倫理的懸念への対処が必要になる可能性',
    ],
    nextSteps: [
      `プロトタイプ: ${inv.sourceConcepts[0]}の属性データを収集・構造化`,
      `検証: ターゲット（${inv.targetUsers}）5〜10人へのインタビュー`,
      `MVP: 最小機能でのコンセプト実証`,
      `改善: フィードバックを元に融合ロジックを洗練`,
    ],
  }

  return NextResponse.json(detail)
}

function buildRequiredTech(inv: InventionIdea): string[] {
  const base = ['プロトタイプ設計・製作能力']
  if (inv.scores.feasibility >= 4) {
    base.push('既存技術の組み合わせで実現可能（新技術開発不要）')
  } else if (inv.scores.feasibility <= 2) {
    base.push('未実証の技術要素を含む（R&D投資が必要）')
  }
  if (inv.pattern === '物理化' || inv.pattern === '本人化') {
    base.push('センサー・アクチュエーター技術', 'フィジカルコンピューティング')
  }
  if (inv.pattern === '状態連動') {
    base.push('リアルタイムデータ処理', 'イベント駆動アーキテクチャ')
  }
  if (inv.pattern === '取引化') {
    base.push('決済・トークン設計', 'マーケットプレイス構築')
  }
  base.push(`${inv.sourceConcepts[0]}ドメインの専門知識`)
  return base
}

function buildBusinessModel(inv: InventionIdea): string {
  if (inv.scores.usefulness >= 4) {
    return `SaaS型月額課金。${inv.targetUsers}向けサブスクリプション。初期はフリーミアムで獲得し、高度機能で収益化。`
  } else if (inv.scores.weirdness >= 4) {
    return `アート/体験型プロダクト。限定販売・展示・ライセンス販売。ファン経済モデルが適合。`
  } else {
    return `B2B向けカスタム導入。${inv.targetUsers}が属する企業・組織への提供。初期はパイロット案件から実績を積む。`
  }
}
