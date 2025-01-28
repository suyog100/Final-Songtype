import { Link } from "react-router-dom";
import {
  AboutCode,
  AboutDiscord,
  AboutMail,
  AboutSupport,
  AboutX,
} from "../../assets/icons/AboutIcons";

const Support = () => {
  return (
    <>
      <section className='about-content'>
        <h2>Donate</h2>
        <p>
          If you liked the weibsite and want to support its development, you can
          donate us using the below support button
        </p>
        <Link to={"/donate"} className='about-button'>
          <AboutSupport />
          Donate
        </Link>
        <Link to={"/donations"} className='about-button'>
          <AboutMail />
          See Donations
        </Link>
      </section>

      <section className='about-content'>
        <h2>support</h2>
        <p>
          If you need assistance, have questions, or want to provide feedback,
          feel free to reach out! You can join our Discord community, send an
          email, contact us on Twitter, or submit an issue on GitHub. We're
          always happy to help and continuously work on improving your typing
          experience.
        </p>
        <div className='contact-buttons'>
          <button className='about-button'>
            <AboutMail />
            Mail
          </button>
          <button className='about-button'>
            <AboutX />
            Twitter
          </button>
          <button className='about-button'>
            <AboutDiscord />
            Discord
          </button>
          <button className='about-button'>
            <AboutCode />
            GitHub
          </button>
        </div>
      </section>
    </>
  );
};

export default Support;
