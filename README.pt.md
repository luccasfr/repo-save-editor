# R.E.P.O Save Editor

[<img src="https://flagcdn.com/w20/us.png" alt="United States Flag"> English Version](./README.md)

<img src="src/app/icon.png" alt="Logo do R.E.P.O Save Editor" width="200" height="200" />

## Visão Geral

O R.E.P.O Save Editor é uma aplicação web que permite modificar arquivos de salvamento do jogo R.E.P.O. Esta ferramenta ajuda os jogadores a ajustar vários parâmetros do jogo, incluindo:

- Estatísticas e atributos dos jogadores
- Estatísticas de corrida e moedas
- Itens comprados e melhorias
- Configurações e ajustes de equipe

**Experimente agora: [https://repo-save-editor.vercel.app](https://repo-save-editor.vercel.app)**

## Tecnologias

Este projeto é construído usando tecnologias web modernas:

- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca de UI
- **TypeScript** - JavaScript com tipos
- **TailwindCSS 4** - Framework CSS utilitário
- **next-intl** - Suporte para internacionalização
- **shadcn/ui** - Componentes de UI acessíveis construídos com Radix UI
- **Lucide React** - Conjunto de ícones bonitos e consistentes

## Como Começar

```bash
# Clone o repositório
git clone https://github.com/luccasfr/repo-save-editor.git

# Navegue para o diretório do projeto
cd repo-save-editor

# Instale as dependências
pnpm install

# Inicie o servidor de desenvolvimento
pnpm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para acessar a aplicação.

## Como Usar

1. Localize seu arquivo de salvamento do R.E.P.O (normalmente em `%USERPROFILE%\AppData\LocalLow\semiwork\Repo\saves`)
2. Faça upload do arquivo de salvamento para o editor
3. Faça as alterações desejadas
4. Baixe o arquivo de salvamento modificado
5. Substitua seu arquivo de salvamento original pelo modificado

## Compilando para Produção

```bash
# Crie uma build otimizada para produção
pnpm run build

# Inicie o servidor de produção
node .next/standalone/server.js
```

## Agradecimentos

Agradecimentos especiais ao [R.E.P.O Save Editor de N0edL](https://github.com/N0edL/R.E.P.O-Save-Editor) por fornecer as funções de criptografia com a chave em Python, as quais foram extraídas e implementadas em Node.js para este projeto.

## Autor

<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/luccasfr">
          <img src="https://github.com/luccasfr.png?size=100" alt="Lucas Ferreira" />
          <p>Lucas Ferreira</p>
        </a>
      </td>
    </tr>
  </tbody>
</table>
