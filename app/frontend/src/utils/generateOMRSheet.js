// app/frontend/src/utils/generateOMRSheet.js

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const drawCircleWithText = (page, x, y, text, fontSize) => {
  const circleSize = 8;
  page.drawCircle({
    x,
    y,
    size: circleSize / 2,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  page.drawText(text, {
    x: x - fontSize / 4,
    y: y - fontSize / 3,
    size: fontSize,
  });
};

export const generateDetailedOMRSheet = async (totalQuestions, optionsPerQuestion) => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const createIdentificationPage = () => {
    const page = pdfDoc.addPage([600, 900]);
    const { width, height } = page.getSize();
    const fontSize = 6;
    const margin = 40;

    page.setFont(font);
    page.setFontSize(fontSize);

    // Title
    const title = "Student Identification";
    const titleWidth = font.widthOfTextAtSize(title, fontSize);
    page.drawText(title, {
      x: (width - titleWidth) / 2,
      y: height - margin,
    });

    // Student ID Section
    const idLabel = "Student I.D.";
    page.drawText(idLabel, {
      x: margin,
      y: height - margin - 40,
    });

    const idColumns = "0123456789".split("");
    const idYStart = height - margin - 60;
    idColumns.forEach((col, colIndex) => {
      page.drawText(col, {
        x: margin + colIndex * 20 + 10,
        y: idYStart,
      });
      for (let i = 0; i < 10; i++) {
        drawCircleWithText(page, margin + colIndex * 20 + 10, idYStart - (i + 1) * 20, String(i), fontSize);
      }
    });

    // Name Sections
    ["First Name", "Last Name"].forEach((nameField, fieldIndex) => {
      const nameYStart = idYStart - 220 - fieldIndex * 220;
      page.drawText(nameField, {
        x: margin,
        y: nameYStart,
      });

      // Draw empty boxes for inputting letters
      for (let i = 0; i < 20; i++) {
        page.drawRectangle({
          x: margin + i * 20 + 10,
          y: nameYStart - 30,
          width: 10,
          height: 10,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1,
        });
      }

      // Draw letters A-Z
      for (let i = 0; i < 26; i++) {
        page.drawText(String.fromCharCode(65 + i), {
          x: margin + i * 20 + 10,
          y: nameYStart - 50,
        });
        for (let j = 0; j < 20; j++) {
          drawCircleWithText(page, margin + j * 20 + 10, nameYStart - (i + 2) * 20, String.fromCharCode(65 + i), fontSize);
        }
      }
    });
  };

  const createAnswerPage = (questions, options) => {
    const page = pdfDoc.addPage([600, 900]);
    const { width, height } = page.getSize();
    const fontSize = 6;
    const margin = 40;

    page.setFont(font);
    page.setFontSize(fontSize);

    // Title
    const title = "Exam Answer Sheet";
    const titleWidth = font.widthOfTextAtSize(title, fontSize);
    page.drawText(title, {
      x: (width - titleWidth) / 2,
      y: height - margin,
    });

    const instructions = "Please fill in the entire circle that corresponds to your answer for each question.";
    page.drawText(instructions, {
      x: margin,
      y: height - margin - 20,
    });

    // Answer Section
    const startY = height - margin - 60;
    const columns = 3;
    const rowsPerColumn = 25;
    const colWidth = (width - 2 * margin) / columns;
    let currentY = startY;
    let currentX = margin;

    for (let i = 0; i < questions.length; i++) {
      if (i % rowsPerColumn === 0 && i !== 0) {
        currentX += colWidth;
        currentY = startY;
      }

      const questionIndex = questions[i];
      const questionText = `${questionIndex}.`;
      page.drawText(questionText, {
        x: currentX,
        y: currentY,
      });

      for (let opt = 0; opt < options; opt++) {
        drawCircleWithText(page, currentX + 30 + opt * 20, currentY - 5, String.fromCharCode(65 + opt), fontSize);
      }

      currentY -= 20;
    }
  };

  createIdentificationPage();

  const totalPages = Math.ceil(totalQuestions / 75); // 25 questions per column * 3 columns per page
  for (let i = 0; i < totalPages; i++) {
    const startQuestion = i * 75 + 1;
    const endQuestion = Math.min(startQuestion + 74, totalQuestions);
    const questions = Array.from({ length: endQuestion - startQuestion + 1 }, (_, k) => startQuestion + k);
    createAnswerPage(questions, optionsPerQuestion);
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
