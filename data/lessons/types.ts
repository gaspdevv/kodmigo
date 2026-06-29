import type { PathLevel } from "@/lib/onboarding-data";

export type LessonStepType =
  | "info"
  | "multiple-choice"
  | "fill-blank"
  | "output-quiz"
  | "code-order"
  | "debug-choice"
  | "mini-task"
  | "project-step"
  | "code-writing"
  | "match-concept"
  | "complete";

export type LessonStepFeedback = {
  correct: string;
  incorrect: string;
};

export type StepValidation = {
  requiredIncludes?: string[];
  requiredAnyIncludes?: string[];
  requiredPatterns?: string[];
  rejectPatterns?: string[];
  forbiddenExactAnswers?: string[];
  minLength?: number;
  minPrintCount?: number;
  minAssignmentCount?: number;
  minListElements?: number;
  minHabitDictCount?: number;
  minLines?: number;
  mustLookLikePython?: boolean;
  mustIncludePrint?: boolean;
  mustIncludeAssignment?: boolean;
  mustIncludeDef?: boolean;
  mustIncludeIf?: boolean;
  mustIncludeLoop?: boolean;
  /** When true, print() args must use quoted strings (not bare identifiers). Inferred for print-only tasks. */
  requireQuotedStringsInPrint?: boolean;
  /** Require at least one assignment with True/False (not quoted). */
  requiresBoolean?: boolean;
  /** Require at least one f-string print line. */
  requiresFString?: boolean;
  /** Minimum characters inside quoted print for self-intro tasks. */
  selfIntroMinChars?: number;
  /** Task-specific validation mode for clearer rules without overfitting lesson text. */
  validationMode?:
    | "printStringLiteral"
    | "multiplePrintStringLiteral"
    | "variableAssignment"
    | "variableAndPrint"
    | "miniProfile"
    | "fStringIntro"
    | "extendedProfileCard"
    | "miniProject"
    | "inputSumTwoNumbers"
    | "ageCalculatorBasic"
    | "personalizedAgeOutput"
    | "ticketPriceRules"
    | "listAppendAndPrint"
    | "simpleListAndPrint"
    | "habitDictList"
    | "habitCompletionPercentage"
    | "habitTrackerSummaryFunction"
    | "listLoopSummary"
    | "spendingSummaryTotal"
    | "spendingSummaryReport"
    | "functionReturnAndPrint"
    | "mathFunctionAddAndPrint"
    | "booleanHelperFunction"
    | "twoGreetingFunctions"
    | "quizFunctionProject"
    | "scoreCalculatorFunction"
    | "listMembershipCheck"
    | "studentGradeAverage"
    | "categorySpendingTotal"
    | "inputNormalizeStripLower"
    | "wordCountInputSplitLen"
    | "longWordsFilterCount"
    | "taskMarkCompleteByName"
    | "taskTrackerFullProject"
    | "selfIntroPrint"
    | "fString";
  hints?: Partial<Record<
    | "empty"
    | "junk"
    | "tooShort"
    | "notPython"
    | "missingPrint"
    | "emptyPrint"
    | "wrongCasePrint"
    | "unquotedString"
    | "unquotedAssignment"
    | "undefinedPrintVariable"
    | "missingFString"
    | "missingFStringVariable"
    | "undefinedFStringVariable"
    | "missingAssignment"
    | "missingAssignmentCount"
    | "incompleteAssignment"
    | "missingBoolean"
    | "invalidBooleanCase"
    | "missingKeyword"
    | "missingAnyKeyword"
    | "missingStructure"
    | "missingPrintCount"
    | "missingPrintCount3"
    | "missingLines"
    | "consoleLog"
    | "plainTextOnly"
    | "missingInputCount"
    | "missingInputConversion"
    | "missingInputSumPrint"
    | "missingAddition"
    | "missingInputPrompt"
    | "wrongCaseInput"
    | "missingAgeInput"
    | "missingAgeInputConversion"
    | "missingAgeSubtraction"
    | "missingAgePrint"
    | "missingPersonalizedNameInput"
    | "missingPersonalizedBirthYearInput"
    | "missingPersonalizedInputConversion"
    | "missingPersonalizedAgeSubtraction"
    | "missingPersonalizedFStringName"
    | "missingPersonalizedFStringAge"
    | "missingPersonalizedPrint"
    | "missingTicketAgeInput"
    | "missingTicketInputConversion"
    | "missingTicketIf"
    | "missingTicketSecondRule"
    | "missingTicketPriceValue"
    | "missingTicketPrint"
    | "missingListDefinition"
    | "missingListMinElements"
    | "missingListAppend"
    | "wrongCaseAppend"
    | "missingListAppendTarget"
    | "missingListPrint"
    | "missingSimpleListMinElements"
    | "missingSimpleListQuotedElements"
    | "missingHabitDictList"
    | "missingHabitDictFields"
    | "missingHabitDictBooleanNotString"
    | "missingHabitCompletionList"
    | "missingHabitCompletionDictFields"
    | "missingHabitCompletionForLoop"
    | "missingHabitCompletionIfCheck"
    | "missingHabitCompletionLen"
    | "missingHabitCompletionPercentage"
    | "missingHabitCompletionFString"
    | "missingHabitCompletionPrint"
    | "missingHabitTrackerFunction"
    | "missingHabitTrackerParam"
    | "missingHabitTrackerDictStructure"
    | "missingHabitTrackerLen"
    | "missingHabitTrackerForLoop"
    | "missingHabitTrackerIfCheck"
    | "missingHabitTrackerPercentage"
    | "missingHabitTrackerFString"
    | "missingHabitTrackerPrint"
    | "missingHabitTrackerCall"
    | "missingListLoopDefinition"
    | "missingListLoopAppend"
    | "missingListLoopAppendCount"
    | "missingListLoopFor"
    | "missingListLoopForPrint"
    | "missingListLoopLen"
    | "missingListLoopPrint"
    | "missingSpendingListDefinition"
    | "missingSpendingListMinElements"
    | "missingSpendingSum"
    | "missingSpendingSumTarget"
    | "missingSpendingPrint"
    | "wrongCaseSum"
    | "missingSpendingReportSum"
    | "missingSpendingReportAverage"
    | "missingSpendingReportMax"
    | "missingSpendingReportPrint"
    | "missingSpendingReportOutputs"
    | "wrongCaseReportBuiltins"
    | "missingFunctionDef"
    | "missingFunctionParam"
    | "missingFunctionReturn"
    | "missingFunctionParamInReturn"
    | "missingFunctionGreeting"
    | "missingFunctionCall"
    | "missingFunctionPrint"
    | "missingMathFunctionTwoParams"
    | "missingMathFunctionReturn"
    | "missingMathFunctionCall"
    | "missingBooleanHelperParam"
    | "missingBooleanHelperModulo"
    | "missingBooleanHelperBooleanCheck"
    | "missingBooleanHelperReturn"
    | "missingBooleanHelperCall"
    | "missingTwoFunctions"
    | "missingGreetingOneParam"
    | "missingGreetingTwoParam"
    | "missingTwoFunctionReturn"
    | "missingTwoFunctionParamInReturn"
    | "missingTwoFunctionCall"
    | "missingTwoFunctionPrint"
    | "undefinedFunctionFStringVariable"
    | "missingQuizFunction"
    | "missingQuizTwoParams"
    | "missingQuizInput"
    | "missingQuizIf"
    | "missingQuizTwoCalls"
    | "missingQuizEndingMessage"
    | "missingQuizPrint"
    | "undefinedQuizFStringVariable"
    | "missingScoreCalculatorFunctionDef"
    | "missingScoreCalculatorTwoParams"
    | "missingScoreCalculation"
    | "missingScoreNegativeClamp"
    | "missingScoreCalculatorReturn"
    | "missingScoreCalculatorPrint"
    | "missingListMembershipDefinition"
    | "missingListMembershipIn"
    | "missingListMembershipPrint"
    | "missingListMembershipQuotedElements"
    | "missingListMembershipNotString"
    | "missingStudentGradeList"
    | "missingStudentGradeDictFields"
    | "missingStudentGradeNotField"
    | "missingStudentGradeNumericNot"
    | "missingStudentGradeMinCount"
    | "missingStudentGradeTotal"
    | "missingStudentGradeLen"
    | "missingStudentGradeAverage"
    | "missingStudentGradePrint"
    | "missingCategorySpendingList"
    | "missingCategorySpendingDictFields"
    | "missingCategorySpendingKategoriField"
    | "missingCategorySpendingTutarField"
    | "missingCategorySpendingNumericTutar"
    | "missingCategorySpendingMinCount"
    | "missingCategorySpendingForLoop"
    | "missingCategorySpendingIf"
    | "missingCategorySpendingFilter"
    | "missingCategorySpendingTotal"
    | "missingCategorySpendingPrint"
    | "missingInputNormalizeInput"
    | "missingInputNormalizeStrip"
    | "missingInputNormalizeLower"
    | "missingInputNormalizePrint"
    | "wrongCaseStrip"
    | "wrongCaseLower"
    | "missingWordCountInput"
    | "missingWordCountSplit"
    | "missingWordCountLen"
    | "missingWordCountPrint"
    | "missingWordCountLenSplit"
    | "wrongCaseSplit"
    | "wrongCaseLen"
    | "missingLongWordsInput"
    | "missingLongWordsSplit"
    | "missingLongWordsFor"
    | "missingLongWordsIf"
    | "missingLongWordsLen"
    | "missingLongWordsLengthCheck"
    | "missingLongWordsAppend"
    | "missingLongWordsCountPrint"
    | "missingLongWordsListPrint"
    | "missingLongWordsPrint"
    | "missingTaskMarkList"
    | "missingTaskMarkDictFields"
    | "missingTaskMarkAdField"
    | "missingTaskMarkTamamField"
    | "missingTaskMarkBooleanNotString"
    | "missingTaskMarkFor"
    | "missingTaskMarkIf"
    | "missingTaskMarkNameCompare"
    | "missingTaskMarkTamamAssignment"
    | "missingTaskMarkPrint"
    | "wrongCaseFor"
    | "wrongCaseIf"
    | "missingTaskTrackerAllFunctions"
    | "missingTaskTrackerEkle"
    | "missingTaskTrackerListele"
    | "missingTaskTrackerTamamla"
    | "missingTaskTrackerOzet"
    | "missingTaskTrackerDict"
    | "missingTaskTrackerBooleanNotString"
    | "missingTaskTrackerAppend"
    | "missingTaskTrackerTamamlaIf"
    | "missingTaskTrackerTamamAssignment"
    | "missingTaskTrackerOzetLen"
    | "missingTaskTrackerOzetCompletedCount"
    | "missingTaskTrackerExampleUsage"
    | "default",
    string
  >>;
  /** @deprecated Prefer hints.* — must not contain solution code */
  hint?: string;
};

export type MatchPair = {
  concept: string;
  answer: string;
};

export type LessonStep = {
  id: string;
  type: LessonStepType;
  title: string;
  content?: string;
  code?: string;
  fillBlankCode?: string;
  options?: string[];
  orderLines?: string[];
  matchPairs?: MatchPair[];
  correctAnswer?: string;
  migoMessage?: string;
  /** Shown only after a correct answer — may explain the concept */
  migoMessageAfterCorrect?: string;
  feedback?: LessonStepFeedback;
  buttonLabel?: string;
  placeholder?: string;
  expectedText?: string;
  targetOutput?: string;
  expectedBehavior?: string;
  taskNote?: string;
  checklist?: string[];
  exampleSolution?: string;
  validation?: StepValidation;
  completeRewards?: {
    xp: string;
    streak: string;
    nextLesson: string;
  };
};

export type LessonContent = {
  id: string;
  title: string;
  description: string;
  duration: string;
  pathLevel?: PathLevel;
  xpReward?: number;
  steps: LessonStep[];
};

export function isQuizStepType(type: LessonStepType): boolean {
  return (
    type === "multiple-choice" ||
    type === "fill-blank" ||
    type === "output-quiz" ||
    type === "code-order" ||
    type === "debug-choice" ||
    type === "match-concept"
  );
}

export function isTaskStepType(type: LessonStepType): boolean {
  return (
    type === "mini-task" ||
    type === "project-step" ||
    type === "code-writing"
  );
}

export function isValidatedTaskStepType(type: LessonStepType): boolean {
  return (
    type === "code-writing" ||
    type === "project-step" ||
    type === "mini-task"
  );
}

/** Steps where a wrong answer attempt reduces lesson XP (once per step). */
export function isWrongAnswerTrackedStepType(type: LessonStepType): boolean {
  return isQuizStepType(type) || isTaskStepType(type);
}
