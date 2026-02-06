import { sections } from '../../../lib/sections';
import SectionReader from './SectionReader';

export function generateStaticParams() {
  return sections.map((section) => ({
    id: section.id.toString(),
  }));
}

export default function SectionPage({ params }) {
  const sectionId = parseInt(params.id);
  const section = sections.find(s => s.id === sectionId);
  
  return (
    <SectionReader 
      section={section} 
      sections={sections} 
      sectionId={sectionId} 
    />
  );
}
