import { EocGeneralEocSpecific, EocSet } from 'utils/api';

export const DEVELOPMENT_LEVEL = [
  {
    value: 1,
    short: 'Foundational',
    meaning: 'Developing a foundation for university level study',
  },
  {
    value: 2,
    short: 'Broad and Coherent',
    meaning: 'Sufficient capability to enter the workforce as a non-engineer',
  },
  {
    value: 3,
    short: 'Advanced',
    meaning: 'Sufficient capability for professional practice as a starting engineer',
  },
  {
    value: 4,
    short: 'Specialist',
    meaning: 'Selected areas of strength beyond the requirement for entering professional practice',
  },
];

// Dictionary Converter format {level: "short"}
export const developmentLevelToString: { [key: number]: string } = DEVELOPMENT_LEVEL.reduce(
  (accumulator, currentValue, currentIndex) => ({
    ...accumulator,
    [currentIndex + 1]: `Level ${currentIndex + 1} - ${currentValue.short}`,
  }),
  {},
);

/**
 * Use this if you want to get all the EOC Specifics for a particular EOC Set
 */
export const compileAllTheEOCSpecificsOfAnEOCSet = (eocSet: EocSet): EocGeneralEocSpecific[] =>
  eocSet.eoc_generals.reduce(
    (previousValue, currentValue) => previousValue.concat(currentValue.eoc_specifics),
    [] as EocGeneralEocSpecific[],
  );
