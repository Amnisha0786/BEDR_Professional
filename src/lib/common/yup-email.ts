import * as yup from 'yup';

yup.addMethod(yup.string, 'email', function validateEmail(message) {
  return this.matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/gm, {
    message,
    name: 'email',
    excludeEmptyString: true,
  });
});

export default yup;
