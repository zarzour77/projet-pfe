/* eslint-disable react/no-unescaped-entities */
import styles from './Home.module.css';
import user2 from '../assets/user2.jpg';
import user1 from '../assets/user1.jpg';
import user4 from '../assets/user4.avif';
import user5 from '../assets/user5.avif';
import user7 from '../assets/user7.avif';
import user8 from '../assets/user8.jpg';
import gif1 from '../assets/IconDesign.gif'
import gif2 from '../assets/DesignInspiration.gif'
import gif3 from '../assets/CareerProgress.gif'

import "@fortawesome/fontawesome-free/css/all.min.css";

/* Header Component */
const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.navBar}>
        <div className={styles.logo}>Partage de Missions</div>
        <a href="/login" className="Button loginButton">Se connecter / S'inscrire</a>
      </div>
      <div className={styles.headerContent}>
        <h1>Bienvenue sur Partage de Missions</h1>
        <p>Connectez-vous, partagez vos missions et inspirez le monde.</p>
      </div>
    </header>
  );
};


/* Landing Component */
const Home = () => {

  return (
    <>
      <style>{`
      
      .loginButton {
  position: relative; /* Needed for pseudo-element positioning */
  display: inline-block; /* Ensure pseudo-element works */
  overflow: hidden; /* Hide the sliding effect outside */
  background: none;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: bold;
  transition: color 0.3s linear;
  border:1px solid #E1FFBB
}

.loginButton::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:#E1FFBB; /* The color that will slide in */
  transform: scaleX(0); /* Initially hidden (scaled to 0 in X direction) */
  transform-origin: left; /* Start animation from the left */
  transition: transform 0.5s cubic-bezier(0.5, 1.6, 0.4, 0.7);
  z-index: -1; /* Behind the text */
}

.loginButton:hover {
  color: #009990; /* Change text color on hover */
}

.loginButton:hover::before {
  transform: scaleX(1); /* Reveal background by scaling X to full width */
}

        /* General Layout */
        .container { width: 100%; max-width: 1140px; margin: 0 auto; position: relative; }
        .row { display: flex; flex-wrap: wrap; margin-right: -15px; margin-left: -15px; }
        .col, .col-lg-6, .col-lg-4, .col-lg-12, .col-lg-8, .col-lg-3, .col-4, .col-md-6 { padding: 15px; flex: 1; }
        .px-0 { padding-left: 0; padding-right: 0; }
        .d-flex { display: flex; }
        .justify-content-center { justify-content: center; }
        .align-items-center { align-items: center; }
        .text-center { text-align: center; }
        .img-fluid { max-width: 100%; height: auto; }
        .img-center { display: block; margin-left: auto; margin-right: auto; }
        .shadow { box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15); }
        .shadow-lg--hover:hover { box-shadow: 0 rem 3rem rgba(0,0,0,0.175); }
        
        /* Section Spacing */
        .section { position: relative; padding: 60px 0; }
        .section-lg { padding: 120px 0; }
        .pb-250 { padding-bottom: 250px; }
        .pt-lg-0 { padding-top: 0; }
        .mt--200 { margin-top: -200px; }
        .pb-300 { padding-bottom: 300px; }
        
        /* Colors & Typography */
        .text-white { color: #fff; }
        .text-primary { color: #5e72e4; }
        .text-success { color: #2dce89; }
        .text-warning { color: #fb6340; }
        .display-3 { font-size: 3rem; font-weight: bold; }
        .lead { font-size: 1.25rem; font-weight: 300; }
        
        /* Buttons */
        .btn { padding: 0.75rem 1.25rem; border-radius: 0.375rem; text-decoration: none; display: inline-block; }
        .btn-lg { font-size: 1.125rem; padding: 0.875rem 1.5rem; }
        .btn-block { display: block; width: 100%; }
        .btn-icon { display: flex; align-items: center; }
        .btn-info { background-color: #11cdef; color: #fff; }
        .btn-white { background-color: #fff; color: #172b4d; }
        .btn-primary { background-color: #5e72e4; color: #fff; }
        .btn-default { background-color: #f8f9fa; color: #172b4d; }
        .btn-warning { background-color: #fb6340; color: #fff; }
        .btn-success { background-color: #2dce89; color: #fff; }
        .btn-inner--icon { margin-right: 0.5rem; }
        .mb-3 { margin-bottom: 1rem; }
        .mb-sm-0 { margin-bottom: 0; }
        .mt-4 { margin-top: 1.5rem; }
        .mt-5 { margin-top: 3rem; }
        
        /* Badges */
        .badge { padding: 0.25em 0.5em; border-radius: 0.2rem; font-size: 75%; }
        .badge-pill { border-radius: 10rem; }
        .badge-primary { background-color: #001A6E; color: #fff; }
        .badge-success { background-color: #009990; color: #fff; }
        .badge-warning { background-color: #074799; color: #fff; }
        
        /* Cards */
        .card1 {box-shadow: 1.5px 1px 6px #001A6E; background: #fff; border-radius: 0.375rem; overflow: hidden; }
        .card1 h6{color:#001A6E}
        .card2 {
  box-shadow: 2px 1px 6px #009990;
  background: url('/assets/IconDesign.gif');
  background-size: cover;
  border-radius: 0.375rem;
  overflow: hidden;
}
  .card2 h6{
  color:#009990}
  .interfaceModerne{
  background: linear-gradient(260deg, #E1FFBB,rgb(9, 114, 252));
  }
  .Utilisateur{
    background-color :#009990;

  }
        .card3 {box-shadow: 2px 1px 6px #074799; background: #fff; border-radius: 0.375rem; overflow: hidden; }
        .card3 h6{color:#074799}
        .cardInt{ background-color :rgba(0, 153, 143, 0); box-shadow: 2px 6px 18px rgba(0, 0, 0, 0.3); }
        .card-lift--hover:hover { transform: translateY(-7px); transition: all 0.3s ease; }
        .border-0 { border: 0; }
        .card-body { padding: 2rem; }
        .py-5 { padding-top: 3rem; padding-bottom: 3rem; }
        
        .rejoignez{
  background: linear-gradient(100deg, #001A6E,#009990)}
  ;
        /* Icons */
        .icon { font-size: 2rem; }
        .icon-shape { width: 60px; height: 60px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; }
        .rounded-circle { margin-right :30px; margin-top:32px; box-shadow: 2px 6px 18px rgba(0, 0, 0, 0.3) ;border-radius: 50%!important; }
        .mb-4 { margin-bottom: 1.5rem; }
        
        /* Shapes & Separators */
        .shape { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
        .shape-style-1 { display: flex; flex-wrap: wrap; justify-content: space-around; align-items: center; }
        .shape-default span { display: inline-block; background: rgba(0, 0, 0, 0.1); margin: 5px; width: 30px; height: 30px; border-radius: 50%; }
        .separator { position: relative; display: block; width: 100%; overflow: hidden; line-height: 0; }
        .separator svg { display: block; width: calc(100% + 1.3px); height: 100px; }
        .fill-white { fill: #fff; }
        
        /* Gradients */
        .bg-gradient-warning { background: linear-gradient(87deg, #fb6340 0, #fbb140 100%); }
        .bg-gradient-default { background: linear-gradient(87deg, #5e72e4 0, #825ee4 100%); }
        .bg-gradient-secondary { background: linear-gradient(87deg, #6c757d 0, #a9aeb4 100%); }
        .bg-gradient-success { background: linear-gradient(87deg, #2dce89 0, #5fdc8c 100%); }
        
        /* Spacing Helpers */
        .py-lg-md { padding: 2rem 0; }
        .pl-md-5 { padding-left: 3rem; }
        .pr-md-5 { padding-right: 3rem; }
        .mt--300 { margin-top: -300px; }
        
        /* Form */
        .form-group { margin-bottom: 1rem; }
        .input-group { display: flex; }
        .input-group-prepend { display: flex; }
        .input-group-text { padding: 0.5rem 0.75rem; background: #eee; border: 1px solid #ccc; }
        .form-control { flex: 1 1 auto; padding: 0.5rem 0.75rem; border: 1px solid #ccc; }
        .form-control-alternative { background-color: #f9f9f9; }
        .btn-round { border-radius: 2rem; }
        .focused { border: 2px solid #5e72e4; }
      `}</style>

      {/* Render the Header */}
      <Header />
      <main >
        {/* Section: Trois Cartes de Mission */}
        <section className="section section-lg pt-lg-0 mt--200">
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-lg-12">
        <div className="row row-grid">
          {/* Carte 1: Découvrir */}
          <div className="col-lg-4">
  <div className="card card1 card-lift--hover border-0" style={{ position: 'relative', overflow: 'hidden' }}>
    <div
      className="card-body py-5"
      style={{ position: 'relative', zIndex: 2, transform: 'translateY(-50px)' }}
    >
      <div className="icon icon-shape icon-shape-primary rounded-circle mb-4">
        <i style={{color:'#001A6E'}} className="fas fa-search"></i> {/* Changed to relevant FA icon */}
      </div>
      <h6 className="text text-uppercase">Découvrir les Missions</h6>
      <p className="description mt-3">
        Explorez des missions passionnantes et trouvez celles qui correspondent à vos valeurs.
      </p>
      <div>
        <span className="badge badge-pill badge-primary">exploration</span>
        <span className="badge badge-pill badge-primary">inspiration</span>
        <span className="badge badge-pill badge-primary">communauté</span>
      </div>
      <a href="/login" style={{backgroundColor:'#001A6E',color:'white'}} className="btn  mt-4">Découvrir</a>
    </div>
    {/* Positioned Image Under Text */}
    <img
      src={gif2}
      alt="Card 1 image"
      style={{
        position: 'absolute',
        bottom: '-13px',
        right: '-5px',
        width: '200px',
        height: '200px',
        objectFit: 'contain',
        zIndex: 1
      }}
    />
  </div>
</div>

{/* Carte 2: Créer */}
<div className="col-lg-4">
  <div className="card2 card-lift--hover border-0" style={{ position: 'relative', overflow: 'hidden' }}>
    <div
      className="card-body py-5"
      style={{ position: 'relative', zIndex: 2, transform: 'translateY(-50px)' }}
    >
      <div className="icon icon-shape icon-shape-success rounded-circle mb-4">
        <i style={{color:'#009990'}} className="fas fa-lightbulb"></i>
      </div>
      <h6 className="text-success text-uppercase">Créer une Mission</h6>
      <p className="description mt-3">
        Lancez votre propre mission, mobilisez une équipe et changez le monde.
      </p>
      <div>
        <span className="badge badge-pill badge-success">innovation</span>
        <span className="badge badge-pill badge-success">leadership</span>
        <span className="badge badge-pill badge-success">impact</span>
      </div>
      <a href="/login" style={{backgroundColor:'#009990',color:'white'}} className="btn  mt-4">Démarrer</a>
    </div>
    {/* Positioned Image Under Text */}
    <img
      src={gif1}
      alt="Mission GIF"
      style={{
        position: 'absolute',
        bottom: '10px',
        right: '1px',
        width: '200px',
        height: '200px',
        objectFit: 'contain',
        zIndex: 1
      }}
    />
  </div>
</div>

{/* Carte 3: Partager */}
<div className="col-lg-4">
  <div className="card3 card-lift--hover border-0" style={{ position: 'relative', overflow: 'hidden' }}>
    <div
      className="card-body py-5"
      style={{ position: 'relative', zIndex: 2, transform: 'translateY(-50px)' }}
    >
      <div className="icon icon-shape icon-shape-warning rounded-circle mb-4">
        <i style={{color:'#074799'}} className="fas fa-share-alt"></i> {/* Changed to FA icon */}
      </div>
      <h6 className=" text-uppercase">Partager vos Réussites</h6>
      <p className="description mt-3">
        Diffusez vos succès et inspirez d'autres membres de notre communauté.
      </p>
      <div>
        <span className="badge badge-pill badge-warning">succès</span>
        <span className="badge badge-pill badge-warning">témoignages</span>
        <span className="badge badge-pill badge-warning">inspiration</span>
      </div>
      <a href="/login" style={{backgroundColor:'#074799',color:'white'}} className="btn mt-4">En savoir plus</a>
    </div>
    {/* Positioned Image Under Text */}
    <img
      src={gif3}
      alt="Card 3 image"
      style={{
        position: 'absolute',
        bottom: '-15px',
        right: '-5px',
        width: '200px',
        height: '200px',
        objectFit: 'contain',
        zIndex: 1
      }}
    />
  </div>
</div>

        </div>
      </div>
    </div>
  </div>
</section>

        
        {/* Section: Utilisateurs et Communauté */}
        <section className="section Utilisateur">
          
  <div className="container">
    <div className="row row-grid align-items-center">
      <div className="col-md-6">
        <div className={styles.slider}>
            <div className={styles.slideTrack}>
                
                <div className={styles.slide}>
                    <img src={user2} alt="" />
                </div>
                <div className={styles.slide}>
                    <img src={user1} alt="" />
                </div>
                <div className={styles.slide}>
                    <img src={user8} alt="" />
                </div>
                <div className={styles.slide}>
                    <img src={user4} alt="" />
                </div>
                <div className={styles.slide}>
                    <img src={user5} alt="" />
                </div>
                <div className={styles.slide}>
                    <img src={user7} alt="" />
                </div>
            </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="pl-md-5">
          <div style={{backgroundColor:'#E1FFBB'}} className="icon icon-lg icon-shape  shadow rounded-circle mb-5">
          <i style={{ color: '#009990' }} className="fas fa-users"></i> {/* FontAwesome users icon */}
          </div>
          <h3 className='text-white'>Nos Utilisateurs</h3>
          <p className="lead">
            Nos membres partagent leurs missions, collaborent et inspirent des changements positifs.
          </p>
          <p>
            Participez à des projets qui ont du sens et rejoignez une plateforme où chaque mission compte.
          </p>
          <p>
            Ensemble, nous pouvons créer un impact réel et durable dans le monde.
          </p>
          <a href="/about" className="font-weight-bold text-warning mt-5">
            Découvrez notre histoire
          </a>
        </div>
      </div>
    </div>
  </div>
 
</section>

        
        {/* Section: Interface Moderne et Fonctionnalités */}
        <section className="section pb-0 interfaceModerne">
  <div className="container">
    <div className="row row-grid align-items-center">
      <div className="col-md-6 order-lg-2 ml-lg-auto">
        <div className="position-relative pl-md-5">
          <img src="./assets/img/ill/mission.svg" className="img-center img-fluid" alt="Illustration" />
        </div>
      </div>
      <div className="col-lg-6 order-lg-1">
      <div className="card cardInt   mt-5">
          <div className="card-body">
            <div className="d-flex px-3">
              <div className="mr-3">
                <div style={{backgroundColor:'#E1FFBB'}} className="icon icon-shape   rounded-circle text-white">
                <i style={{ color: '#009990' }} className="fas fa-desktop"></i> {/* Modern interface icon */}
                </div>
              </div>
              <div className="pl-4">
                <h5 className="title text-white">Interface moderne</h5>
                <p>
                Une plateforme intuitive et innovante conçue pour faciliter le partage de missions.                </p>
                <a href="/support" className="text-warning">En savoir plus</a>
              </div>
            </div>
          </div>
        </div>
        <div className="card cardInt   mt-5">
          <div className="card-body">
            <div className="d-flex px-3">
              <div className="mr-3"> {/* Moves icon more to the left */}
                <div style={{backgroundColor:'#E1FFBB'}} className="icon icon-shape  rounded-circle text-white">
                  <i style={{ color: '#009990' }} className="fas fa-headset"></i> {/* Support icon */}
                </div>
              </div>
              <div className="pl-4">
                <h5 className="title text-white">Support Exceptionnel</h5>
                <p>
                  Notre équipe est toujours prête à vous aider pour que votre mission soit un succès.
                </p>
                <a href="/support" className="text-warning">En savoir plus</a>
              </div>
            </div>
          </div>
        </div>
        <div className="card cardInt  mt-5">
          <div className="card-body">
            <div className="d-flex px-3">
              <div className="mr-3"> {/* Moves icon more to the left */}
                <div style={{backgroundColor:'#E1FFBB'}} className="icon icon-shape  rounded-circle text-white">
                  <i style={{ color: '#009990' }} className="fas fa-cogs"></i> {/* Customizable features icon */}
                </div>
              </div>
              <div className="pl-4">
                <h5 className="title text-white">Fonctionnalités Modulables</h5>
                <p>
                  Personnalisez votre expérience et adaptez la plateforme à vos besoins spécifiques.
                </p>
                <a href="/features" className="text-warning">En savoir plus</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* SVG Separator */}
  <div className="separator separator-bottom separator-skew zindex-100">
    <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <polygon className="fill-white" points="2560 0 2560 100 0 100"></polygon>
    </svg>
  </div>
</section>

        
        {/* Section: Notre Équipe */}
        {/* Section: Notre Équipe */}
<section className="section section-lg">
  <div className="container">
    <div className="row justify-content-center text-center mb-lg">
      <div className="col-lg-8">
        <h2 className="display-3">Meilleur Consultants <i style={{color : "rgb(233, 245, 2)"}} className="fa-solid fa-star"></i></h2>
        <p className="lead text-muted">
          Une équipe passionnée dédiée à faciliter le partage de missions et à inspirer des changements positifs.
        </p>
      </div>
    </div>
    <div className="row">
      {/* Membre 1 */}
      <div className="col-md-6 col-lg-3 mb-5 mb-lg-0">
        <div className="px-4">
          <img
            src={user1}
            className="rounded-circle img-center img-fluid shadow shadow-lg--hover"
            style={{ width: '200px' }}
            alt="Membre 1"
          />
          <div className="pt-4 text-center">
            <h5 className="title">
              <span className="d-block mb-1">Alice Martin</span>
              <small className="h6 text-muted">Développeuse Web</small>
            </h5>
            <div className="mt-3">
              <div className="btn btn-warning btn-icon-only rounded-circle">
                <i className="fab fa-angular" style={{ color: 'white' }}></i>
              </div>
              <div className="btn btn-warning btn-icon-only rounded-circle">
                <i className="fab fa-node-js" style={{ color: 'white' }}></i>
              </div>
              <div className="btn btn-warning btn-icon-only rounded-circle">
                <i className="fab fa-react" style={{ color: 'white' }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Membre 2 */}
      <div className="col-md-6 col-lg-3 mb-5 mb-lg-0">
        <div className="px-4">
          <img
            src={user2}
            className="rounded-circle img-center img-fluid shadow shadow-lg--hover"
            style={{ width: '200px' }}
            alt="Membre 2"
          />
          <div className="pt-4 text-center">
            <h5 className="title">
              <span className="d-block mb-1">Julien Dupont</span>
              <small className="h6 text-muted">Stratège Marketing</small>
            </h5>
            <div className="mt-3">
              <div className="btn btn-primary btn-icon-only rounded-circle">
                <i className="fas fa-bullhorn" style={{ color: 'white' }}></i>
              </div>
              <div className="btn btn-primary btn-icon-only rounded-circle">
                <i className="fas fa-chart-line" style={{ color: 'white' }}></i>
              </div>
              <div className="btn btn-primary btn-icon-only rounded-circle">
                <i className="fas fa-envelope" style={{ color: 'white' }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Membre 3 */}
      <div className="col-md-6 col-lg-3 mb-5 mb-lg-0">
        <div className="px-4">
          <img
            src={user4}
            className="rounded-circle img-center img-fluid shadow shadow-lg--hover"
            style={{ width: '200px' }}
            alt="Membre 3"
          />
          <div className="pt-4 text-center">
            <h5 className="title">
              <span className="d-block mb-1">Sophie Lemaire</span>
              <small className="h6 text-muted">Designer UI/UX</small>
            </h5>
            <div className="mt-3">
              <div className="btn btn-info btn-icon-only rounded-circle">
                <i className="fas fa-paint-brush" style={{ color: 'white' }}></i>
              </div>
              <div className="btn btn-info btn-icon-only rounded-circle">
                <i className="fas fa-pencil-alt" style={{ color: 'white' }}></i>
              </div>
              <div className="btn btn-info btn-icon-only rounded-circle">
                <i className="fas fa-drafting-compass" style={{ color: 'white' }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Membre 4 */}
      <div className="col-md-6 col-lg-3 mb-5 mb-lg-0">
        <div className="px-4">
          <img
            src={user5}
            className="rounded-circle img-center img-fluid shadow shadow-lg--hover"
            style={{ width: '200px' }}
            alt="Membre 4"
          />
          <div className="pt-4 text-center">
            <h5 className="title">
              <span className="d-block mb-1">Marc Legrand</span>
              <small className="h6 text-muted">Fondateur & CEO</small>
            </h5>
            <div className="mt-3">
              <div className="btn btn-success btn-icon-only rounded-circle">
                <i className="fas fa-briefcase" style={{ color: 'white' }}></i>
              </div>
              <div className="btn btn-success btn-icon-only rounded-circle">
                <i className="fas fa-chart-pie" style={{ color: 'white' }}></i>
              </div>
              <div className="btn btn-success btn-icon-only rounded-circle">
                <i className="fas fa-lightbulb" style={{ color: 'white' }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

        
        {/* Section: Appel à l'action */}
        <section className="section section-lg pt-0">
          <div className="container">
            <div className="card rejoignez shadow-lg border-0">
              <div className="p-5">
                <div className="row align-items-center">
                  <div className="col-lg-8">
                    <h3 className="text-white">Rejoignez notre communauté de missions</h3>
                    <p className="lead text-white mt-3">
                      Transformez vos idées en actions concrètes et faites partie d'un mouvement qui change le monde.
                    </p>
                  </div>
                  <div className="col-lg-3 ml-lg-auto">
                    <a href="/login"className="btn btn-lg btn-block btn-white">
                      Inscrivez-vous
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Section: Dernier Appel à l'action */}
        <section className="section section-lg">
          <div className="container">
            <div className="row row-grid justify-content-center">
              <div className="col-lg-8 text-center">
                <h2 className="display-3">
                  Vous aimez notre plateforme de missions ?
                </h2>
                <p className="lead">
                  Rejoignez-nous dès aujourd'hui et commencez à partager vos missions pour un avenir meilleur.
                </p>
                <div className="btn-wrapper">
                  <a href="/login" className="btn btn-primary mb-3 mb-sm-0">
                    Rejoignez-nous
                  </a>
                </div>
                <div className="text-center">
                  <h4 className="display-4 mb-5 mt-5">Disponible sur toutes vos plateformes</h4>
                  <div className="row justify-content-center">
                    <div className="col-lg-2 col-4">
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        <img src="https://s3.amazonaws.com/creativetim_bucket/tim_static_images/presentation-page/bootstrap.jpg" className="img-fluid" alt="Bootstrap" />
                      </a>
                    </div>
                    <div className="col-lg-2 col-4">
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        <img src="https://s3.amazonaws.com/creativetim_bucket/tim_static_images/presentation-page/angular.jpg" className="img-fluid" alt="Angular" />
                      </a>
                    </div>
                    <div className="col-lg-2 col-4">
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        <img src="https://s3.amazonaws.com/creativetim_bucket/tim_static_images/presentation-page/vue.jpg" className="img-fluid" alt="Vue.js" />
                      </a>
                    </div>
                    <div className="col-lg-2 col-4">
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        <img src="https://s3.amazonaws.com/creativetim_bucket/tim_static_images/presentation-page/sketch.jpg" className="img-fluid opacity-3" alt="Sketch" />
                      </a>
                    </div>
                    <div className="col-lg-2 col-4">
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        <img src="https://s3.amazonaws.com/creativetim_bucket/tim_static_images/presentation-page/ps.jpg" className="img-fluid opacity-3" alt="Photoshop" />
                      </a>
                    </div>
                    <div className="col-lg-2 col-4">
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        <img src="https://s3.amazonaws.com/creativetim_bucket/tim_static_images/presentation-page/react.jpg" className="img-fluid opacity-3" alt="React" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
