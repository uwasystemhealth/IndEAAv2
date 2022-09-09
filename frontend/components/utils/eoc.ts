import { EocGeneralEocSpecific, EocSet } from 'utils/api';

export const DEVELOPMENT_LEVEL = [
  {
    value: 1,
    short: 'Engineering Fundamentals',
    meaning:
      'Building a foundation of knowledge and skills for studying engineering.  Students solve problems that are clearly defined, with all or most information provided.',
  },
  {
    value: 2,
    short: 'Engineering Applications and Analysis',
    meaning:
      'Integrating elements of the discipline.  Students apply engineering fundamentals to more complex problems that are less-well defined.',
  },
  {
    value: 3,
    short: 'Engineering Practice',
    meaning:
      'Carrying out engineering work to a professional standard.  Students exercise independent judgement to solve open-ended or ill-defined problems. These problems include advanced technical content, and/or contextual elements beyond technical engineering. ',
  },
];

// Dictionary Converter format {level: "short"}
export const developmentLevelToString: { [key: number]: string } = DEVELOPMENT_LEVEL.reduce(
  (accumulator, currentValue, currentIndex) => ({
    ...accumulator,
    [currentIndex + 1]: `Level ${currentIndex + 1} - ${currentValue.short}`,
  }),
  {
    0: 'None',
  },
);

/**
 * Use this if you want to get all the EOC Specifics for a particular EOC Set
 */
export const compileAllTheEOCSpecificsOfAnEOCSet = (eocSet: EocSet): EocGeneralEocSpecific[] =>
  eocSet.eoc_generals.reduce(
    (previousValue, currentValue) => previousValue.concat(currentValue.eoc_specifics),
    [] as EocGeneralEocSpecific[],
  );
