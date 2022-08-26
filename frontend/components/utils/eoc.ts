export const DEVELOPMENT_LEVEL = [
  {
    short: 'Foundational',
    meaning: 'Developing a foundation for university level study',
  },
  {
    short: 'Broad and Coherent',
    meaning: 'Sufficient capability to enter the workforce as a non-engineer',
  },
  {
    short: 'Advanced',
    meaning: 'Sufficient capability for professional practice as a starting engineer',
  },
  {
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
  { 0: 'Select a level' },
);
