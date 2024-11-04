import React, { Dispatch, SetStateAction } from 'react';
import SignatureCanvas from 'react-signature-canvas';

import { COLORS } from '@/lib/constants/color';

type Tprop = {
  sigCanvasRef: React.MutableRefObject<SignatureCanvas | null>;
  setIsSignatureAvailable: Dispatch<SetStateAction<boolean>>;
};

const SignaturePad = ({ sigCanvasRef, setIsSignatureAvailable }: Tprop) => {
  return (
    <div className='w-full '>
      <SignatureCanvas
        penColor='blue'
        backgroundColor={COLORS?.LIGHT_GRAY}
        canvasProps={{ height: '400px', className: 'sigCanvas w-full' }}
        onBegin={() => setIsSignatureAvailable(true)}
        ref={(ref) => {
          sigCanvasRef.current = ref;
        }}
      />
    </div>
  );
};

export default SignaturePad;
