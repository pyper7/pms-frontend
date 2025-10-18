import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Building2, 
  Network,
  Target,
  Shield,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Move,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { OrganogramEntity } from '@/types/organogram';

interface OrganogramViewerProps {
  data: OrganogramEntity[];
  onNodeClick?: (node: OrganogramEntity) => void;
  onNodeAdd?: (parentId: string, type: string) => void;
  onNodeEdit?: (node: OrganogramEntity) => void;
  onNodeDelete?: (nodeId: string) => void;
}

const OrganogramViewer: React.FC<OrganogramViewerProps> = ({
  data,
  onNodeClick,
  onNodeAdd,
  onNodeEdit,
  onNodeDelete
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Auto-expand all nodes by default to show complete structure
  React.useEffect(() => {
    const allNodeIds = data.map(entity => entity.id);
    setExpandedNodes(new Set(allNodeIds));
  }, [data]);

  const toggleExpanded = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleNodeClick = (node: OrganogramEntity) => {
    setSelectedNode(node.id);
    onNodeClick?.(node);
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'BOARD':
        return <Shield className="w-5 h-5 text-blue-600" />;
      case 'EXECUTIVE':
        return <Users className="w-5 h-5 text-purple-600" />;
      case 'DEPT':
        return <Building2 className="w-5 h-5 text-green-600" />;
      case 'DIV':
        return <Network className="w-5 h-5 text-orange-600" />;
      case 'BRANCH':
        return <Target className="w-5 h-5 text-red-600" />;
      default:
        return <Building2 className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'BOARD':
        return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200';
      case 'EXECUTIVE':
        return 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200';
      case 'DEPT':
        return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200';
      case 'DIV':
        return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200';
      case 'BRANCH':
        return 'bg-gradient-to-br from-red-50 to-red-100 border-red-200';
      default:
        return 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200';
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'BOARD':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'EXECUTIVE':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DEPT':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'DIV':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'BRANCH':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNextType = (currentType: string) => {
    switch (currentType) {
      case 'BOARD':
        return 'EXECUTIVE';
      case 'EXECUTIVE':
        return 'DEPT';
      case 'DEPT':
        return 'DIV';
      case 'DIV':
        return 'BRANCH';
      default:
        return 'DIV';
    }
  };

  const handleDeleteNode = (nodeId: string) => {
    onNodeDelete?.(nodeId);
  };

  const renderNode = (node: OrganogramEntity, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode === node.id;

    return (
      <div key={node.id} className="relative">
        {/* Connection Lines */}
        {level > 0 && (
          <>
            {/* Vertical line from parent */}
            <div 
              className="absolute w-px bg-gray-300" 
              style={{ 
                left: `${(level - 1) * 80 + 40}px`,
                top: '-20px',
                height: '40px'
              }} 
            />
            {/* Horizontal line to this node */}
            <div 
              className="absolute h-px bg-gray-300" 
              style={{ 
                left: `${(level - 1) * 80 + 40}px`,
                top: '20px',
                width: '40px'
              }} 
            />
          </>
        )}

        {/* Node Container */}
        <div className="flex items-start mb-8" style={{ marginLeft: `${level * 80}px` }}>
          {/* Expand/Collapse Button */}
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 mr-4 mt-3 hover:bg-gray-100 rounded-full border border-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(node.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          )}
          
          {/* Spacer for nodes without children */}
          {!hasChildren && <div className="w-8 h-8 mr-4" />}

          {/* Node Card */}
          <Card 
            className={`
              relative p-6 cursor-pointer transition-all duration-300 hover:shadow-xl min-w-[300px] max-w-[350px]
              ${getNodeColor(node.type)}
              ${isSelected ? 'ring-2 ring-blue-500 shadow-xl scale-105' : 'hover:shadow-lg hover:scale-102'}
            `}
            onClick={() => handleNodeClick(node)}
          >
            {/* Node Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-white/70 shadow-sm">
                  {getNodeIcon(node.type)}
                </div>
                <div>
                  <Badge variant="secondary" className={`${getBadgeColor(node.type)} text-xs font-semibold px-2 py-1`}>
                    {node.type}
                  </Badge>
                  {hasChildren && (
                    <Badge variant="outline" className="text-xs ml-2 px-2 py-1">
                      {node.children?.length} {node.children?.length === 1 ? 'child' : 'children'}
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-1">
                {onNodeAdd && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 hover:bg-blue-100 text-blue-600 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNodeAdd(node.id, getNextType(node.type));
                    }}
                    title="Add Child"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
                {onNodeEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 hover:bg-gray-100 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNodeEdit(node);
                    }}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
                {onNodeDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 hover:bg-red-100 text-red-600 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNode(node.id);
                    }}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Node Content */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg leading-tight">{node.name}</h3>
              {node.description && (
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{node.description}</p>
              )}
              {node.headOfUnit && (
                <div className="bg-white/60 rounded-xl p-4 border border-white/50">
                  <div className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">Head of Unit</div>
                  <div className="text-sm font-semibold text-gray-900">{node.headOfUnit.name}</div>
                  <div className="text-xs text-gray-600">{node.headOfUnit.position}</div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="ml-12">
            {node.children?.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Build tree structure
  const buildTree = (entities: OrganogramEntity[]): OrganogramEntity[] => {
    // Create a deep copy to avoid mutating the original data
    const entitiesCopy = entities.map(entity => ({ ...entity, children: entity.children || [] }));
    const entityMap = new Map(entitiesCopy.map(entity => [entity.id, entity]));
    const roots: OrganogramEntity[] = [];

    entitiesCopy.forEach(entity => {
      if (entity.parentId) {
        const parent = entityMap.get(entity.parentId);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(entity);
        }
      } else {
        roots.push(entity);
      }
    });

    return roots;
  };

  const treeData = buildTree(data);

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            TETFund Organizational Structure
          </h1>
          <p className="text-gray-600 text-lg">
            Interactive organizational chart showing departments, divisions, and branches
          </p>
        </div>

        {/* Legend */}
        <div className="mb-8 flex flex-wrap justify-center gap-6">
          <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Board</span>
          </div>
          <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm">
            <Users className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Executive</span>
          </div>
          <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm">
            <Building2 className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Department</span>
          </div>
          <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm">
            <Network className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">Division</span>
          </div>
          <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm">
            <Target className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-gray-700">Branch</span>
          </div>
        </div>

        {/* Tree Structure */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="space-y-6">
            {treeData.length > 0 ? (
              treeData.map(root => renderNode(root))
            ) : (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No organizational data available</p>
                <p className="text-sm text-gray-400 mt-2">
                  Tree data: {treeData.length} roots, Raw data: {data.length} entities
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganogramViewer;