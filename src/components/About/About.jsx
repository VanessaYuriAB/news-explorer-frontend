import './About.css';
import me from '../../assets/eu.png';

function About() {
  return (
    <section className="about main__about">
      <div className="about__img-box">
        <img className="about__avatar" src={me} alt="Foto de avatar" />
      </div>
      <div className="about__text-box">
        <h2 className="about__title">Sobre a autora</h2>
        <p className="about__description">
          Me chamo Vanessa e sou desenvolvedora web em formação pelo bootcamp
          TripleTen Brasil (full‑stack). Sou mãe solteira do Belquior, que tem 4
          anos, no momento. Atualmente estou dedicando-me aos estudos,
          desenvolvendo meu projeto final, este aplicativo. Ao longo da jornada,
          adquiri experiência em HTML, CSS, JavaScript, React, Vite, Express.js
          e MongoDB, além de deploy de aplicações full‑stack em produção, com
          front‑end hospedado no Vercel e back‑end no Google Cloud, utilizando
          subdomínio via DNS gratuito.
          <br></br>
          <br></br>
          Gosto de transformar ideias em produtos funcionais, acessíveis e bem
          estruturados, integrando front‑end e back‑end, trabalhando com APIs
          REST, autenticação e boas práticas de versionamento com Git/GitHub.
          Hoje, o Copilot é meu parceiro diário de desenvolvimento.
        </p>
      </div>
    </section>
  );
}

export default About;
