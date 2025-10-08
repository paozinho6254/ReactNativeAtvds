export const parseTankDetails = (extract) => {
  const sections = [];
  let currentSection = { title: 'Introdução', content: [] };
  const lines = extract.split('\n');

  for (const line of lines) {
    const sectionMatch = line.match(/^==\s*(.+?)\s*==$/);
    if (sectionMatch) {
      if (currentSection.content.length > 0 || currentSection.title !== 'Introdução') {
        sections.push(currentSection);
      }
      currentSection = { title: sectionMatch[1], content: [] };
    } else if (line.trim() !== '') {
      currentSection.content.push(line.trim());
    }
  }
  if (currentSection.content.length > 0 || currentSection.title !== 'Introdução') {
    sections.push(currentSection);
  }

  const formattedSections = sections.map(section => {
    if (section.title === 'Operadores' || section.title === 'Utilizadores') {
      const formattedContent = section.content.map(line => {
        const countryMatch = line.match(/^\s*(\w[\w\s.-]*?):\s*(.+)$/);
        if (countryMatch) {
          const country = countryMatch[1].trim();
          const details = countryMatch[2].trim();
          return `${country}: ${details}`;
        }
        return line;
      });
      return { ...section, content: formattedContent };
    }
    return section;
  });

  let introduction = '';
  if (sections[0] && sections[0].title === 'Introdução') {
    introduction = sections[0].content.join('\n');
    formattedSections.shift();
  }


  return {
    introduction: introduction,
    sections: formattedSections.filter(sec => sec.content.length > 0)
  };
};