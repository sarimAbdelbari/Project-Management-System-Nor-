
import { FaBook } from 'react-icons/fa';
import { GoProject } from "react-icons/go";
import { FaProjectDiagram } from "react-icons/fa";
import { GiTrade } from "react-icons/gi";
import { MdArticle } from "react-icons/md";
import { IoMdContacts } from 'react-icons/io';
import { GiBookmarklet } from "react-icons/gi";

export const links = [
  {
    title: 'Structure Projet',
    links: [
      {
        name: 'Créer Projet',
        link: 'NewProject',
        icon: <GoProject  />,
      },
      {
        name: 'Créer Corps Etat',
        link: 'NewCorpsEtat',

        icon: <GiTrade  />,
      },
      {
        name: 'Créer article',
        link: 'NewArticle',
        icon: <MdArticle />,
      },
      {
        name: 'Affecter Responsable',
        link: 'NewEmployee',
        icon: <IoMdContacts />,
      },
    ],
  },

  {
    title: '---------------------------------',
    links: [
      {
        name: 'Créer responsable Projet',
        link: 'NewResponsiableProject',
        icon: <GiBookmarklet />,
      },
      {
        name: 'Créer Structure Projet',
        link: 'NewStructureProject',
        icon: <FaProjectDiagram  />,
      },
      {
        name: 'Structure Projet',
        link: 'StructureProject',
        icon: <FaBook  />,
      },
    ],
  },
];
