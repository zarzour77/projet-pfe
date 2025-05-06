/* eslint-disable react/no-unescaped-entities */
import { Link } from "react-router-dom";
// Remove Button import
import Button from '@mui/material/Button';
import { Search, Briefcase, Users, Award, ArrowRight, CheckCircle } from "lucide-react"
import styles from "./home.module.css"
import Header from "../Components/Header";  // Adjust the path as needed
import Footer from "./Footer";
export default function Home() {

  return (
    <div className={styles.homeContainer}>
      {/* Header placeholder */}
      <Header />

      <div className={styles.headerPlaceholder}></div>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.containerA}>
          <div className={styles.heroContent}>
            <div className={`${styles.heroText} ${styles.fadeIn}`}>
              <div className={styles.badge}>Plateforme de missions freelance</div>
              <h1 className={styles.heroTitle}>
                Connectez <span className={styles.highlight}>talents</span> et <span className={styles.highlight}>entreprises</span>
              </h1>
              <p className={styles.heroDescription}>
                La plateforme qui permet aux freelancers de trouver des missions et aux entreprises de découvrir les
                meilleurs talents.
              </p>
              <div className={styles.heroButtons}>
                <Button className={`${styles.primaryButton} ${styles.slideUp}`}>Trouver une mission</Button>
                <Button variant="outline" className={`${styles.secondaryButton} ${styles.slideUpDelay}`}>
                  Publier une mission
                </Button>
              </div>
            </div>
            <div className={`${styles.heroImageContainer} ${styles.fadeInDelay}`}>
              <div className={styles.heroImageGlow}></div>
              <img
  src="/placeholder.svg"
  alt="Freelancers working"
  className={styles.heroImage}
  style={{
    width: '600px',
    height: '600px'
  }}
/>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className={`${styles.searchSection} ${styles.fadeIn}`}>
        <div className={styles.containerA}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Trouvez la mission parfaite</h2>
            <p className={styles.sectionDescription}>
              Des milliers de missions disponibles pour tous les profils de freelancers
            </p>
          </div>

          <div className={styles.searchContainer}>
            <div className={styles.searchForm}>
              <div className={styles.searchInputContainer}>
                <Search className={styles.searchIcon} size={20} />
                <input 
        type="text"
        placeholder="Rechercher par compétence ou mot-clé"
        className={styles.searchInput}
      />              </div>
              <Button className={styles.searchButton}>Rechercher</Button>
            </div>

            <div className={styles.searchTags}>
              <span className={styles.searchTag}>Développement Web</span>
              <span className={styles.searchTag}>Design UX/UI</span>
              <span className={styles.searchTag}>Marketing Digital</span>
              <span className={styles.searchTag}>Data Science</span>
              <span className={styles.searchTag}>DevOps</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.containerA}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Comment ça fonctionne</h2>
            <p className={styles.sectionDescription}>
              Une plateforme simple et efficace pour connecter les talents et les entreprises
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={`${styles.featureCard} ${styles.slideUp}`}>
              <div className={styles.featureIcon}>
                <Briefcase className={styles.icon} size={24} />
              </div>
              <h3 className={styles.featureTitle}>Publiez vos missions</h3>
              <p className={styles.featureDescription}>
                Les entreprises peuvent publier leurs besoins en détaillant les compétences requises et le budget
                alloué.
              </p>
            </div>

            <div className={`${styles.featureCard} ${styles.slideUpDelay1}`}>
              <div className={styles.featureIcon}>
                <Users className={styles.icon} size={24} />
              </div>
              <h3 className={styles.featureTitle}>Trouvez des talents</h3>
              <p className={styles.featureDescription}>
                Parcourez les profils de freelancers qualifiés et trouvez le candidat idéal pour votre projet.
              </p>
            </div>

            <div className={`${styles.featureCard} ${styles.slideUpDelay2}`}>
              <div className={styles.featureIcon}>
                <Award className={styles.icon} size={24} />
              </div>
              <h3 className={styles.featureTitle}>Collaborez sereinement</h3>
              <p className={styles.featureDescription}>
                Notre plateforme sécurise les paiements et facilite la communication entre les parties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Missions Section */}
      <section className={styles.missionsSection}>
        <div className={styles.containerA}>
          <div className={styles.sectionHeaderWithLink}>
            <h2 className={styles.sectionTitle}>Missions populaires</h2>
            <Link href="/SearchMission" className={styles.sectionLink}>
              Voir toutes les missions <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.missionsGrid}>
            {[1, 2, 3, 4, 5, 6].map((item, index) => (
              <div key={item} className={`${styles.missionCard} ${styles[`fadeInDelay${index % 3}`]}`}>
                <div className={styles.missionContent}>
                  <div className={styles.missionHeader}>
                    <div>
                      <span className={styles.missionTag}>
                        {item % 3 === 0 ? "Design" : item % 2 === 0 ? "Développement" : "Marketing"}
                      </span>
                      <h3 className={styles.missionTitle}>
                        {item % 3 === 0
                          ? "Refonte UX/UI application mobile"
                          : item % 2 === 0
                            ? "Développement API REST"
                            : "Stratégie marketing digital"}
                      </h3>
                    </div>
                    <div className={styles.missionPrice}>{item * 100 + 400}€/j</div>
                  </div>

                  <p className={styles.missionDescription}>
                    {item % 3 === 0
                      ? "Nous recherchons un designer UX/UI pour refondre notre application mobile..."
                      : item % 2 === 0
                        ? "Développement d'une API REST pour notre plateforme e-commerce..."
                        : "Mise en place d'une stratégie marketing digital pour augmenter notre visibilité..."}
                  </p>

                  <div className={styles.missionFooter}>
                    <div className={styles.missionCompany}>
                      <div className={styles.companyAvatar}></div>
                      <span className={styles.companyName}>Entreprise {item}</span>
                    </div>
                    <span className={styles.missionLocation}>{item % 2 === 0 ? "Remote" : "Hybride"}</span>
                  </div>
                </div>

                <div className={styles.missionAction}>
                  <Button className={styles.applyButton}>Postuler</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.containerA}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Ils nous font confiance</h2>
            <p className={styles.sectionDescription}>
              Découvrez les témoignages de freelancers et d'entreprises qui utilisent notre plateforme
            </p>
          </div>

          <div className={styles.testimonialsGrid}>
            <div className={`${styles.testimonialCard} ${styles.slideInLeft}`}>
              <div className={styles.testimonialHeader}>
                <div className={styles.testimonialAvatar}></div>
                <div className={styles.testimonialAuthor}>
                  <h4 className={styles.authorName}>Sophie Martin</h4>
                  <p className={styles.authorTitle}>Développeuse Full Stack</p>
                </div>
              </div>
              <p className={styles.testimonialText}>
                "Grâce à cette plateforme, j'ai pu trouver des missions intéressantes qui correspondent parfaitement à
                mes compétences. Le processus de paiement est sécurisé et la communication avec les clients est
                facilitée."
              </p>
              <div className={styles.testimonialRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="#4299e1"
                    stroke="none"
                    className={styles.star}
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
            </div>

            <div className={`${styles.testimonialCard} ${styles.slideInRight}`}>
              <div className={styles.testimonialHeader}>
                <div className={styles.testimonialAvatar}></div>
                <div className={styles.testimonialAuthor}>
                  <h4 className={styles.authorName}>Thomas Dubois</h4>
                  <p className={styles.authorTitle}>Directeur Technique, TechInnovate</p>
                </div>
              </div>
              <p className={styles.testimonialText}>
                "Nous avons trouvé des freelancers de qualité pour nos projets urgents. La plateforme nous a permis de
                gagner un temps précieux dans notre processus de recrutement et d'accélérer le développement de nos
                produits."
              </p>
              <div className={styles.testimonialRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="#4299e1"
                    stroke="none"
                    className={styles.star}
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.containerA}>
          <div className={styles.ctaContent}>
            <div className={styles.ctaText}>
              <h2 className={styles.ctaTitle}>Prêt à commencer ?</h2>
              <p className={styles.ctaDescription}>
                Rejoignez notre communauté de freelancers et d'entreprises et trouvez votre prochaine opportunité dès
                aujourd'hui.
              </p>
              <div className={styles.ctaButtons}>
                <Button className={`${styles.ctaPrimaryButton} ${styles.pulse}`}>Créer un compte</Button>
                <Button variant="outline" className={styles.ctaSecondaryButton}>
                  En savoir plus
                </Button>
              </div>
            </div>
            <div className={styles.ctaFeatures}>
              <div className={styles.ctaFeature}>
                <CheckCircle className={styles.ctaFeatureIcon} />
                <div>
                  <h4 className={styles.ctaFeatureTitle}>Paiements sécurisés</h4>
                  <p className={styles.ctaFeatureDescription}>Tous les paiements sont sécurisés et garantis</p>
                </div>
              </div>
              <div className={styles.ctaFeature}>
                <CheckCircle className={styles.ctaFeatureIcon} />
                <div>
                  <h4 className={styles.ctaFeatureTitle}>Talents vérifiés</h4>
                  <p className={styles.ctaFeatureDescription}>Tous les freelancers sont vérifiés et qualifiés</p>
                </div>
              </div>
              <div className={styles.ctaFeature}>
                <CheckCircle className={styles.ctaFeatureIcon} />
                <div>
                  <h4 className={styles.ctaFeatureTitle}>Support réactif</h4>
                  <p className={styles.ctaFeatureDescription}>Notre équipe est disponible pour vous aider</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
<Footer/>
    </div>
  )
}