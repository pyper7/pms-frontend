import { OrganogramData, OrganogramEntity } from '@/types/organogram';

export const tetfundOrganogramData: OrganogramData = {
  entities: [
    // Board of Trustees (Level 0) - System Node
    {
      id: 'board-trustees',
      name: 'BOARD OF TRUSTEES',
      type: 'BOARD',
      level: 0,
      order: 1,
      description: 'Highest governing body of TETFund'
    },
    
    // Executive Secretary (Level 1) - System Node
    {
      id: 'executive-secretary',
      name: 'EXECUTIVE SECRETARY',
      type: 'EXECUTIVE',
      parentId: 'board-trustees',
      level: 1,
      order: 1,
      description: 'Chief Executive Officer of TETFund'
    }
  ]
};

// Utility function to build organogram tree
export const buildOrganogramTree = (entities: OrganogramEntity[]): OrganogramEntity[] => {
  const entityMap = new Map(entities.map(entity => [entity.id, { ...entity, children: [] }]));
  const roots: OrganogramEntity[] = [];

  entities.forEach(entity => {
    if (entity.parentId) {
      const parent = entityMap.get(entity.parentId);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(entityMap.get(entity.id)!);
      }
    } else {
      roots.push(entityMap.get(entity.id)!);
    }
  });

  return roots;
};