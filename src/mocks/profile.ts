export type Social = { network: 'Instagram' | 'TikTok' | 'YouTube'; handle: string; followers: number }

export type Profile = {
  name: string
  handle: string
  role: string
  city: string
  bio: string
  email: string
  phone: string
  niches: string[]
  socials: Social[]
  priceFrom: number
  mediaKit: boolean
  portfolio: number
  engagement: number
  partnerships: number
}

export const allNiches = ['Moda', 'Beleza', 'Esporte', 'Lifestyle', 'Tecnologia', 'Alimentação', 'Viagem', 'Maternidade', 'Pets', 'Humor']

export const initialProfile: Profile = {
  name: 'Andressa Lima',
  handle: 'andressa.lima',
  role: 'Criadora de conteúdo',
  city: 'Fortaleza - CE',
  bio: 'Apaixonada por moda, beleza e o dia a dia real. Aqui tem criatividade, rotina e muito conteúdo bom!',
  email: 'andressa@conecta.app',
  phone: '',
  niches: ['Moda', 'Beleza', 'Lifestyle'],
  socials: [
    { network: 'Instagram', handle: '@andressa.lima', followers: 12500 },
    { network: 'TikTok', handle: '@andressalima', followers: 8300 },
    { network: 'YouTube', handle: '', followers: 0 },
  ],
  priceFrom: 450,
  mediaKit: false,
  portfolio: 4,
  engagement: 4.8,
  partnerships: 7,
}

export type CompletenessItem = { key: string; label: string; done: boolean; weight: number }

export function completeness(p: Profile): { score: number; items: CompletenessItem[] } {
  const items: CompletenessItem[] = [
    { key: 'name', label: 'Nome e @ preenchidos', done: !!p.name.trim() && !!p.handle.trim(), weight: 10 },
    { key: 'bio', label: 'Bio com pelo menos 60 caracteres', done: p.bio.trim().length >= 60, weight: 15 },
    { key: 'city', label: 'Cidade informada', done: !!p.city.trim(), weight: 10 },
    { key: 'niches', label: 'Ao menos 2 nichos escolhidos', done: p.niches.length >= 2, weight: 15 },
    { key: 'socials', label: 'Três redes sociais conectadas', done: p.socials.every((s) => s.handle.trim()), weight: 15 },
    { key: 'contact', label: 'Telefone para contato', done: !!p.phone.trim(), weight: 10 },
    { key: 'price', label: 'Valor inicial por publicação', done: p.priceFrom > 0, weight: 10 },
    { key: 'mediaKit', label: 'Mídia kit enviado', done: p.mediaKit, weight: 15 },
  ]
  const score = items.reduce((sum, item) => sum + (item.done ? item.weight : 0), 0)
  return { score, items }
}
