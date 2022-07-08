import { useEffect, useState } from 'react';

// https://docs.djangoproject.com/en/4.0/ref/csrf/
const getCookie = (cookie: string, name: string) => {
  let cookieValue = 'ERROR';
  if (cookie && cookie !== '') {
    const cookies = cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

const CsrfToken = () => {
  const [cookie, setCookie] = useState('');

  useEffect(() => {
    setCookie(document.cookie);
  });

  console.log(cookie);

  return (
    <input type="hidden" name="csrfmiddlewaretoken" value={getCookie(cookie, 'csrftoken')}></input>
  );
};

export default CsrfToken;
export { getCookie };
