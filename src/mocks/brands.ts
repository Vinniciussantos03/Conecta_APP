export type Segment = 'Moda' | 'Beleza' | 'Esporte' | 'Lifestyle' | 'Tecnologia' | 'Alimentação' | 'Viagem'

export type Opportunity = {
  id: string
  brand: string
  initials: string
  hue: number
  verified: boolean
  segment: Segment
  brandFollowers: string
  campaign: string
  summary: string
  looking: string[]
  formats: string[]
  minFollowers: number
  region: string
  mode: 'Remoto' | 'Presencial' | 'Híbrido'
  budget: [number, number]
  deadline: string
  slots: number
  match: number
  isNew?: boolean
}

export const segments: Segment[] = ['Moda', 'Beleza', 'Esporte', 'Lifestyle', 'Tecnologia', 'Alimentação', 'Viagem']

export const opportunities: Opportunity[] = [
  { id: 'aurora', brand: 'Aurora Cosméticos', initials: 'AC', hue: 320, verified: true, segment: 'Beleza', brandFollowers: '2,1M', campaign: 'Linha Glow Verão', summary: 'Buscamos criadoras que mostrem rotina de skincare real, sem filtro, com foco em pele natural no calor.', looking: ['Rotina de skincare', 'Linguagem leve e honesta', 'Público 18–34'], formats: ['Reels', 'Stories'], minFollowers: 5000, region: 'Brasil', mode: 'Remoto', budget: [800, 1500], deadline: '28 nov', slots: 12, match: 94, isNew: true },
  { id: 'pulso', brand: 'Pulso Sport', initials: 'PS', hue: 265, verified: true, segment: 'Esporte', brandFollowers: '3,4M', campaign: 'Movimento Real', summary: 'Campanha para criadores que vivem o esporte no dia a dia: corrida, academia ou dança.', looking: ['Treinos do dia a dia', 'Autenticidade', 'Vídeos curtos'], formats: ['Reels', 'TikTok'], minFollowers: 8000, region: 'Brasil', mode: 'Remoto', budget: [1200, 2500], deadline: '05 dez', slots: 20, match: 81 },
  { id: 'lumi', brand: 'Lumi Moda', initials: 'LM', hue: 285, verified: true, segment: 'Moda', brandFollowers: '1,2M', campaign: 'Coleção Essenciais', summary: 'Queremos looks do cotidiano com peças-chave da coleção, em provador ou na rua.', looking: ['Looks do dia', 'Estética clean', 'Fotos + vídeo'], formats: ['Carrossel', 'Reels'], minFollowers: 3000, region: 'Nordeste', mode: 'Híbrido', budget: [600, 1200], deadline: '30 nov', slots: 8, match: 89, isNew: true },
  { id: 'nexo', brand: 'Nexo Tech', initials: 'NT', hue: 230, verified: false, segment: 'Tecnologia', brandFollowers: '860K', campaign: 'Unboxing Nexo Buds', summary: 'Procuramos criadores para unboxing e primeiras impressões dos novos fones sem fio.', looking: ['Unboxing', 'Review sincero', 'Boa captação de áudio'], formats: ['YouTube Shorts', 'Reels'], minFollowers: 10000, region: 'Brasil', mode: 'Remoto', budget: [900, 1800], deadline: '12 dez', slots: 6, match: 62 },
  { id: 'sabor', brand: 'Sabor da Terra', initials: 'ST', hue: 25, verified: true, segment: 'Alimentação', brandFollowers: '540K', campaign: 'Receitas de 15 minutos', summary: 'Receitas rápidas com nossos temperos naturais, gravadas na cozinha de casa.', looking: ['Receitas práticas', 'Cozinha real', 'Tom divertido'], formats: ['Reels', 'TikTok'], minFollowers: 2000, region: 'Brasil', mode: 'Remoto', budget: [400, 900], deadline: '02 dez', slots: 15, match: 72 },
  { id: 'rota', brand: 'Rota Viagens', initials: 'RV', hue: 190, verified: true, segment: 'Viagem', brandFollowers: '1,8M', campaign: 'Nordeste em 3 dias', summary: 'Roteiros curtos por cidades do Nordeste, mostrando experiências locais e hospedagem parceira.', looking: ['Roteiros', 'Mora no Nordeste', 'Storytelling'], formats: ['Reels', 'Stories', 'Carrossel'], minFollowers: 6000, region: 'Nordeste', mode: 'Presencial', budget: [1500, 3200], deadline: '15 dez', slots: 4, match: 87 },
  { id: 'vibe', brand: 'Vibe Bebidas', initials: 'VB', hue: 150, verified: false, segment: 'Lifestyle', brandFollowers: '720K', campaign: 'Fim de tarde Vibe', summary: 'Momentos de fim de tarde com amigos, música e a nova linha de bebidas sem açúcar.', looking: ['Lifestyle', 'Encontros com amigos', 'Público 21+'], formats: ['Reels', 'Stories'], minFollowers: 4000, region: 'Brasil', mode: 'Remoto', budget: [500, 1100], deadline: '08 dez', slots: 10, match: 76 },
  { id: 'brisa', brand: 'Brisa Beauty', initials: 'BB', hue: 340, verified: true, segment: 'Beleza', brandFollowers: '980K', campaign: 'Make em 5 minutos', summary: 'Tutoriais de maquiagem rápida para o dia a dia usando a nova paleta Brisa.', looking: ['Tutorial', 'Make rápida', 'Close-up nítido'], formats: ['Reels', 'TikTok'], minFollowers: 3000, region: 'Brasil', mode: 'Remoto', budget: [700, 1300], deadline: '01 dez', slots: 9, match: 91 },
]

export const formatBRL = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value)
export const formatCompact = (value: number) => new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
