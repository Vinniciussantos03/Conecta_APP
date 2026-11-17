export type WeekPoint = { label: string; views: number; brands: number; followers: number }

const weeksBase = [
  { views: 95, brands: 1, followers: 40 },
  { views: 110, brands: 1, followers: 55 },
  { views: 102, brands: 2, followers: 48 },
  { views: 125, brands: 2, followers: 60 },
  { views: 140, brands: 2, followers: 72 },
  { views: 132, brands: 1, followers: 65 },
  { views: 158, brands: 2, followers: 80 },
  { views: 170, brands: 3, followers: 92 },
  { views: 165, brands: 2, followers: 88 },
  { views: 182, brands: 3, followers: 101 },
  { views: 195, brands: 3, followers: 110 },
  { views: 188, brands: 2, followers: 104 },
  { views: 210, brands: 3, followers: 120 },
  { views: 260, brands: 4, followers: 160 },
  { views: 240, brands: 3, followers: 140 },
  { views: 310, brands: 5, followers: 210 },
  { views: 355, brands: 6, followers: 260 },
  { views: 330, brands: 5, followers: 230 },
  { views: 420, brands: 8, followers: 310 },
  { views: 470, brands: 9, followers: 350 },
  { views: 455, brands: 8, followers: 330 },
  { views: 540, brands: 11, followers: 420 },
  { views: 610, brands: 13, followers: 480 },
  { views: 690, brands: 15, followers: 560 },
]

const weekLabel = (weeksAgo: number) => {
  const date = new Date()
  date.setDate(date.getDate() - weeksAgo * 7)
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(date).replace('.', '')
}

export const weeklyData: WeekPoint[] = weeksBase.map((w, i) => ({ ...w, label: weekLabel(weeksBase.length - 1 - i) }))

export type Viewer = { brand: string; initials: string; hue: number; segment: string; when: string; action: string }

export const recentViewers: Viewer[] = [
  { brand: 'Aurora Cosméticos', initials: 'AC', hue: 320, segment: 'Beleza', when: 'há 2 horas', action: 'Salvou seu perfil' },
  { brand: 'Lumi Moda', initials: 'LM', hue: 285, segment: 'Moda', when: 'há 5 horas', action: 'Viu seu mídia kit' },
  { brand: 'Rota Viagens', initials: 'RV', hue: 190, segment: 'Viagem', when: 'ontem', action: 'Visitou seu perfil' },
  { brand: 'Brisa Beauty', initials: 'BB', hue: 340, segment: 'Beleza', when: 'ontem', action: 'Enviou uma mensagem' },
  { brand: 'Pulso Sport', initials: 'PS', hue: 265, segment: 'Esporte', when: 'há 2 dias', action: 'Visitou seu perfil' },
  { brand: 'Vibe Bebidas', initials: 'VB', hue: 150, segment: 'Lifestyle', when: 'há 3 dias', action: 'Visitou seu perfil' },
]

export const segmentShare = [
  { segment: 'Beleza', value: 38 },
  { segment: 'Moda', value: 27 },
  { segment: 'Lifestyle', value: 16 },
  { segment: 'Esporte', value: 11 },
  { segment: 'Outros', value: 8 },
]

export const networkStats = [
  { network: 'Instagram', followers: 12500, engagement: 4.8, growth: 6.2 },
  { network: 'TikTok', followers: 8300, engagement: 7.1, growth: 11.4 },
  { network: 'YouTube', followers: 0, engagement: 0, growth: 0 },
]
