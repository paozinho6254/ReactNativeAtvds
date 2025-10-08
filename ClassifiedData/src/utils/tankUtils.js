export const parseTankDetails = (extract) => {
  const sections = [];
  let currentSection = { title: 'Introdução', content: [] };
  const lines = extract.split('\n');

  for (const line of lines) {
    // Verifica se é um título de seção (ex: == Título ==)
    const sectionMatch = line.match(/^==\s*(.+?)\s*==$/);
    if (sectionMatch) {
      if (currentSection.content.length > 0 || currentSection.title !== 'Introdução') {
        sections.push(currentSection);
      }
      currentSection = { title: sectionMatch[1], content: [] };
    } else if (line.trim() !== '') {
      // Adiciona a linha ao conteúdo da seção atual, ignorando linhas vazias
      currentSection.content.push(line.trim());
    }
  }
  if (currentSection.content.length > 0 || currentSection.title !== 'Introdução') {
    sections.push(currentSection);
  }

  // Agora, vamos tentar formatar a seção "Operadores" ou "Utilizadores"
  const formattedSections = sections.map(section => {
    if (section.title === 'Operadores' || section.title === 'Utilizadores') {
      // Aqui você pode adicionar lógica mais sofisticada para extrair países e quantidades.
      // Por enquanto, vamos apenas garantir que o conteúdo não seja vazio.
      // Para bandeiras, você teria que ter um mapeamento local ou buscar ícones.
      const formattedContent = section.content.map(line => {
        // Exemplo: " Paquistão: 400 Type 69-IIMP em serviço.[2]"
        // Poderíamos tentar extrair "Paquistão" e "400 Type 69-IIMP"
        const countryMatch = line.match(/^\s*(\w[\w\s.-]*?):\s*(.+)$/);
        if (countryMatch) {
          const country = countryMatch[1].trim();
          const details = countryMatch[2].trim();
          // Aqui você poderia, por exemplo, buscar uma imagem de bandeira para 'country'
          // e renderizar um componente personalizado.
          return `${country}: ${details}`;
        }
        return line;
      });
      return { ...section, content: formattedContent };
    }
    return section;
  });

  // Separa a introdução (primeira seção antes de qualquer título ==)
  let introduction = '';
  if (sections[0] && sections[0].title === 'Introdução') {
    introduction = sections[0].content.join('\n');
    formattedSections.shift(); // Remove a introdução das seções para não duplicar
  }


  return {
    introduction: introduction,
    sections: formattedSections.filter(sec => sec.content.length > 0) // Remove seções vazias
  };
};