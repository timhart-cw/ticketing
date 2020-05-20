import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Landing Page</h1>;
};

//this is executed server side (pre-rendering)
LandingPage.getInitialProps = async ({ req }) => {
  if (typeof window === 'undefined') {
    //on the server requires full url
    const { data } = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      {
        headers: req.headers,
      }
    );
    return data;
  } else {
    //on the browser can use base url
    const { data } = await axios.get('/api/users/currentuser');
    return data;
  }
  // const response = await axios.get('/api/users/currentuser');
  // return response.data;
  console.log('I WAS EXEC');
  return {};
};
export default LandingPage;
