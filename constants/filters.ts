import { Filter } from '@/types/filter';

export const CATEGORY_OPTIONS = ['PAPER', 'SCHEME'] as const;
export const PART_OPTIONS = ['Part 1', 'Part 2'] as const;
export const LANGUAGE_OPTIONS = ['English', 'Tamil'] as const;
export const SUBJECT_OPTIONS = [
    'Mathematics',
    "Science"

] as const;

export const YEAR_OPTIONS = Array.from(
    { length: new Date().getFullYear() - 2020 + 2 },
    (_, i) => (new Date().getFullYear() + 1 - i).toString()
);

export const FILTERS: Filter[] = [
    {
        key: 'subject',
        label: 'Subject',
        type: 'dropdown',
        options: Array.from(SUBJECT_OPTIONS),
        dynamic: true,
    },
    {
        key: 'year',
        label: 'Year',
        type: 'dropdown',
        options: YEAR_OPTIONS,
        dynamic: true,
    },
    {
        key: 'category',
        label: 'Category',
        type: 'dropdown',
        options: Array.from(CATEGORY_OPTIONS),
    },
    {
        key: 'part',
        label: 'Part',
        type: 'dropdown',
        options: Array.from(PART_OPTIONS),
        dynamic: true,
    },
];
