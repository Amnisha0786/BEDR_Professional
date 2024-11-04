import forge from 'node-forge';

type TEncryptedData = {
  encryptedData: string;
  encryptedSymmetricKey: string;
  iv: string;
};

type TEncryptionRequest = {
  data: any;
  publicKey: string;
};

type TDecryptionRequest = {
  data: TEncryptedData;
  privateKey: string;
  message?: string;
  status?: number;
};

export const encryptData = ({ data, publicKey }: TEncryptionRequest) => {
  const updatedPublicKey = publicKey.replace(/\\r\\n/g, '\n');

  const publicKeyObj = forge.pki.publicKeyFromPem(updatedPublicKey);
  const symmetricKey = forge.random.getBytesSync(32);
  const iv = forge.random.getBytesSync(16);

  const cipher = forge.cipher.createCipher('AES-CBC', symmetricKey);
  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(JSON.stringify(data), 'utf8'));
  cipher.finish();
  const encryptedData = cipher.output.getBytes();

  const encryptedSymmetricKey = publicKeyObj.encrypt(symmetricKey, 'RSA-OAEP', {
    md: forge.md.sha256.create(),
    mgf1: {
      md: forge.md.sha256.create(),
    },
  });
  return {
    encryptedData: forge.util.encode64(encryptedData),
    iv: forge.util.encode64(iv),
    encryptedSymmetricKey: forge.util.encode64(encryptedSymmetricKey),
  };
};

export const decryptData = ({
  data,
  privateKey,
  message,
  status,
}: TDecryptionRequest) => {
  if (!data) return;
  const { encryptedData, iv, encryptedSymmetricKey } = data;
  const updatePrivateKey = privateKey?.replace(/\\r\\n/g, '\n');

  const privateKeyObj = forge.pki.privateKeyFromPem(updatePrivateKey);
  const symmetricKey = privateKeyObj.decrypt(
    forge.util.decode64(encryptedSymmetricKey),
    'RSA-OAEP',
    {
      md: forge.md.sha256.create(),
      mgf1: {
        md: forge.md.sha256.create(),
      },
    },
  );

  const decipher = forge.cipher.createDecipher('AES-CBC', symmetricKey);
  decipher.start({ iv: forge.util.decode64(iv) });
  decipher.update(forge.util.createBuffer(forge.util.decode64(encryptedData)));
  decipher.finish();
  const decryptedData = decipher.output.toString();
  const response = JSON.parse(decryptedData);
  return { data: response, message, status };
};
