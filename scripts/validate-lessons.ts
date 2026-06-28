import { beginnerLessons } from "../data/lessons/beginnerContent";
import { basicLessons } from "../data/lessons/basicContent";
import { intermediateLessons } from "../data/lessons/intermediateContent";
import {
  formatLessonValidationIssue,
  validateAllLessons,
} from "../data/lessons/validate";

const lessons = {
  ...beginnerLessons,
  ...basicLessons,
  ...intermediateLessons,
};

const issues = validateAllLessons(lessons);

if (issues.length > 0) {
  for (const issue of issues) {
    console.error(formatLessonValidationIssue(issue));
  }
  process.exit(1);
}

console.log("Lesson validation passed.");
