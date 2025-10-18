export interface OrganogramEntity {
  id: string;
  name: string;
  type: 'BOARD' | 'EXECUTIVE' | 'DEPT' | 'DIV' | 'BRANCH';
  parentId?: string;
  level: number;
  order: number;
  description?: string;
  headOfUnit?: {
    name: string;
    position: string;
    email?: string;
    phone?: string;
  };
  children?: OrganogramEntity[];
}

export interface OrganogramData {
  entities: OrganogramEntity[];
  rootEntity: OrganogramEntity | null;
}

export interface OrganogramNode {
  id: string;
  name: string;
  type: 'BOARD' | 'EXECUTIVE' | 'DEPT' | 'DIV' | 'BRANCH';
  level: number;
  parentId?: string;
  children: OrganogramNode[];
  headOfUnit?: {
    name: string;
    position: string;
    email?: string;
    phone?: string;
  };
  isExpanded?: boolean;
}

export interface OrganogramViewProps {
  data: OrganogramData;
  onNodeClick?: (node: OrganogramNode) => void;
  onNodeAdd?: (parentId: string, type: 'DEPT' | 'DIV' | 'BRANCH') => void;
  onNodeEdit?: (node: OrganogramNode) => void;
  onNodeDelete?: (nodeId: string) => void;
}
