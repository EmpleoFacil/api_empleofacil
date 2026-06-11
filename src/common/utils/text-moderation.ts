import { BadRequestException } from '@nestjs/common';

const OFFENSIVE_TERMS = [
  'puta',
  'puta madre',
  'puto',
  'mierda',
  'pendejo',
  'pendeja',
  'estupido',
  'estupida',
  'idiota',
  'imbecil',
  'cabron',
  'cabrona',
  'malparido',
  'malparida',
  'hijueputa',
  'hijo de puta',
  'verga',
  'culo',
  'coño',
  'joder',
];

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function hasOffensiveContent(value?: string | null) {
  if (!value) return false;
  const normalized = normalizeText(value);
  return OFFENSIVE_TERMS.some((term) => normalized.includes(term));
}

export function assertNoOffensiveContent(
  entries: Array<{ label: string; value?: string | null }>,
) {
  const invalid = entries.find((entry) => hasOffensiveContent(entry.value));
  if (!invalid) return;

  throw new BadRequestException(
    `El campo "${invalid.label}" contiene palabras ofensivas no permitidas.`,
  );
}
