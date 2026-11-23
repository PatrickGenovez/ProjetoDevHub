import React from 'react';
import Link from 'next/link';
import { Library, Mail, Phone, Clock } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Grade principal: 4 colunas */}
        <div className={styles.grid}>
          {/* Marca */}
          <div className={styles.brand}>
            <div className={styles.logoRow}>
              <Library size={20} className={styles.logoIcon} />
              <span className={styles.logoText}>BIBLIOTECH</span>
            </div>
            <p className={styles.desc}>
              Sua livraria online e clube literário. Clássicos, edições especiais e curadoria entregues na sua porta.
            </p>
          </div>

          {/* Navegação */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Navegação</h4>
            <Link href="/catalogo" className={styles.link}>Catálogo</Link>
            <Link href="/#planos-section" className={styles.link}>Planos do Clube</Link>
            <Link href="/comunidade" className={styles.link}>Comunidade</Link>
            <Link href="/#como-funciona" className={styles.link}>Como Funciona</Link>
          </div>

          {/* Pagamento */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Pagamento</h4>
            <span className={styles.info}>PIX com 5% de desconto</span>
            <span className={styles.info}>Cartão em até 6x</span>
            <span className={styles.info}>Boleto Bancário</span>
            <span className={styles.info}>Compra Protegida (SSL)</span>
          </div>

          {/* Atendimento */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Atendimento</h4>
            <a href="mailto:suporte@bibliotech.com.br" className={styles.contactLink}>
              <Mail size={14} />
              <span>suporte@bibliotech.com.br</span>
            </a>
            <a href="https://wa.me/5511987654321" target="_blank" rel="noreferrer" className={styles.contactLink}>
              <Phone size={14} />
              <span>(11) 98765-4321</span>
            </a>
            <div className={styles.contactItem}>
              <Clock size={14} />
              <span>Seg a Sex: 08h – 20h</span>
            </div>
          </div>
        </div>

        {/* Linha inferior */}
        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} Bibliotech Livraria &amp; Clube Literário. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
