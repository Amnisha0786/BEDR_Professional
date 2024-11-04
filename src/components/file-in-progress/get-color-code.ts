import { COLOR_CODING } from '@/enums/file-in-progress';
import { COLORS } from '@/lib/constants/color';

export const getColorCode = (color: string) => {
  const colorCode = {
    border: '',
    background: '',
  };
  if (color === COLOR_CODING.RED) {
    colorCode.border = COLORS.RED;
    colorCode.background = COLORS.LIGHT_RED;
  } else if (color === COLOR_CODING.YELLOW) {
    colorCode.border = COLORS.YELLOW;
    colorCode.background = COLORS.LIGHT_YELLOW;
  } else if (color === COLOR_CODING.GREEN) {
    colorCode.border = COLORS.GREEN;
    colorCode.background = COLORS.LIGHT_GREEN;
  } else {
    (colorCode.border = COLORS.PRIMARY),
      (colorCode.background = COLORS.LIGHT_PRIMARY);
  }
  return colorCode;
};
