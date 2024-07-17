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
      const nameYStart = idYStart - 220 - fieldIndex * 300;
      page.drawText(nameField, {
        x: margin,
        y: nameYStart,
      });

      // Draw header (blank space and A-Z)
      const header = ["_", ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];
      header.forEach((char, charIndex) => {
        page.drawText(char, {
          x: margin + charIndex * 20 + 10,
          y: nameYStart - 20,
        });
      });

      // Draw circles for each row starting with blank and followed by A-Z
      const alphabet = "_ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      for (let row = 0; row < 10; row++) {
        const rowYStart = nameYStart - 40 - (row + 1) * 20;
        for (let col = 0; col < 27; col++) {  // 27 columns: one for blank and 26 for A-Z
          if (col === 0) {
            // Draw the row label (A-J for first name, K-T for last name)
            const rowLabel = String.fromCharCode(65 + row + (fieldIndex * 10));
            page.drawText(rowLabel, {
              x: margin,
              y: rowYStart,
            });
          }
          drawCircleWithText(page, margin + col * 20 + 10, rowYStart, alphabet[col], fontSize);
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
