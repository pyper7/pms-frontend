
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import OrganogramViewer from '@/components/OrganogramViewer';
import { tetfundOrganogramData } from '@/data/tetfund-organogram';
import { OrganogramNode, OrganogramEntity } from '@/types/organogram';
import { apiService } from '@/services/api';
import { toast } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal, ModalHeader, ModalFooter } from '@/components/ui/modal';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Building2,
  Network,
  Target,
  Users,
  Shield,
  X
} from 'lucide-react';

const Organogram: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedNode, setSelectedNode] = useState<OrganogramNode | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [organogramData, setOrganogramData] = useState(tetfundOrganogramData.entities);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    variant: 'default' | 'destructive' | 'warning' | 'success';
  } | null>(null);
  const [createForm, setCreateForm] = useState({
    name: '',
    type: 'DEPT',
    description: '',
    parentId: '',
    parentType: ''
  });
  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Helper function to convert tree structure to flat array
  const flattenTree = (nodes: any[], level = 0): OrganogramEntity[] => {
    let result: OrganogramEntity[] = [];
    nodes.forEach(node => {
      const entity: OrganogramEntity = {
        id: node.id,
        name: node.name,
        type: node.type,
        description: node.description,
        parentId: node.parentId,
        level: level,
        order: node.order || 1,
        headOfUnit: node.headOfUnit,
        children: node.children ? node.children.map((child: any) => ({
          id: child.id,
          name: child.name,
          type: child.type,
          description: child.description,
          parentId: child.parentId,
          level: level + 1,
          order: child.order || 1,
          headOfUnit: child.headOfUnit,
          children: child.children || []
        })) : []
      };
      result.push(entity);
      
      // Recursively process children but don't add them to the flat array
      // The children are already included in the entity.children array above
      if (node.children && node.children.length > 0) {
        const childEntities = flattenTree(node.children, level + 1);
        // Don't concat children here - they're already in the entity.children array
        // result = result.concat(childEntities); // This was causing duplication
      }
    });
    return result;
  };

  // Load organizational units from API
  useEffect(() => {
    const loadOrganizationalUnits = async () => {
      setIsLoading(true);
      try {
        const res = await apiService.getOrganizationalTree();
        if (res.success && res.data && res.data.tree) {
          // Pass the tree structure directly instead of flattening
          setOrganogramData(res.data.tree);
        } else {
          // Fallback to mock data if API fails
          setOrganogramData(tetfundOrganogramData.entities);
          toast.error('Failed to load organizational units, using mock data');
        }
      } catch (error: any) {
        // Fallback to mock data on error
        setOrganogramData(tetfundOrganogramData.entities);
        toast.error(error?.message || 'Failed to load organizational units, using mock data');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrganizationalUnits();
  }, []);

  const handleNodeClick = (node: OrganogramEntity) => {
    setSelectedNode(node as OrganogramNode);
  };

  // Helper function to find a node in tree structure
  const findNodeInTree = (nodes: any[], nodeId: string): any => {
    for (const node of nodes) {
      if (node.id === nodeId) {
        return node;
      }
      if (node.children) {
        const found = findNodeInTree(node.children, nodeId);
        if (found) return found;
      }
    }
    return null;
  };

  const handleOpenCreateModal = (parentId: string, type: string) => {
    
    // Find the parent node to get its type
    const parentNode = findNodeInTree(organogramData, parentId);
    
    setCreateForm({
      name: '',
      type: type,
      description: '',
      parentId: parentId,
      parentType: parentNode?.type || ''
    });
    setShowCreateModal(true);
    
  };

  const handleNodeEdit = (node: OrganogramEntity) => {
    setEditForm({
      id: node.id,
      name: node.name,
      description: node.description || ''
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editForm.name.trim()) {
      toast.error('Please enter a name for the organizational unit');
      return;
    }

    setIsSaving(true);
    try {
      const res = await apiService.updateOrganizationalUnit(editForm.id, {
        name: editForm.name.trim(),
        description: editForm.description.trim()
      });

      if (res.success && res.data) {
        // Refresh the organizational tree
        const treeRes = await apiService.getOrganizationalTree();
        if (treeRes.success && treeRes.data && treeRes.data.tree) {
          setOrganogramData(treeRes.data.tree);
        }

        toast.success('Organizational unit updated successfully');
    setShowEditModal(false);
    setEditForm({ id: '', name: '', description: '' });
      } else {
        toast.error('Failed to update organizational unit');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update organizational unit');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNodeDelete = (nodeId: string) => {
    const node = organogramData.find(n => n.id === nodeId);
    if (!node) return;

    setConfirmAction({
      title: 'Delete Organizational Unit',
      message: `Are you sure you want to delete "${node.name}"? This action cannot be undone and will remove all associated data.`,
      onConfirm: async () => {
        try {
          const res = await apiService.deleteOrganizationalUnit(nodeId, true);
          
          if (res.success) {
            // Refresh the organizational tree
            const treeRes = await apiService.getOrganizationalTree();
            if (treeRes.success && treeRes.data && treeRes.data.tree) {
              setOrganogramData(treeRes.data.tree);
            }
        
        // Clear selection if deleted node was selected
        if (selectedNode?.id === nodeId) {
          setSelectedNode(null);
        }

            toast.success('Organizational unit deleted successfully');
          } else {
            toast.error('Failed to delete organizational unit');
          }
        } catch (error: any) {
          toast.error(error?.message || 'Failed to delete organizational unit');
        } finally {
        setShowConfirmDialog(false);
        setConfirmAction(null);
        }
      },
      variant: 'destructive'
    });
    setShowConfirmDialog(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createForm.name.trim()) {
      toast.error('Please enter a name for the organizational unit');
      return;
    }

    setIsSaving(true);
    try {
      const res = await apiService.createOrganizationalUnit({
      name: createForm.name.trim(),
        type: createForm.type,
      description: createForm.description.trim(),
        parentId: createForm.parentId || undefined,
        mdaId: '1', // Default to TETFund for now
        order: 1
      });

      if (res.success && res.data) {
        // Refresh the organizational tree
        const treeRes = await apiService.getOrganizationalTree();
        if (treeRes.success && treeRes.data && treeRes.data.tree) {
          setOrganogramData(treeRes.data.tree);
        }

        toast.success('Organizational unit created successfully');
    setShowCreateModal(false);
        setCreateForm({
          name: '',
          type: 'DEPT',
          description: '',
          parentId: '',
          parentType: ''
        });
      } else {
        toast.error('Failed to create organizational unit');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create organizational unit');
    } finally {
      setIsSaving(false);
    }
  };

  const getLevelForType = (type: string, parentId: string): number => {
    const parent = organogramData.find(e => e.id === parentId);
    if (!parent) return 1;
    
    switch (type) {
      case 'DEPT':
        return parent.level + 1;
      case 'DIV':
        return parent.level + 1;
      case 'BRANCH':
        return parent.level + 1;
      default:
        return parent.level + 1;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'BOARD':
        return <Shield className="w-4 h-4" />;
      case 'EXECUTIVE':
        return <Users className="w-4 h-4" />;
      case 'DEPT':
        return <Building2 className="w-4 h-4" />;
      case 'DIV':
        return <Network className="w-4 h-4" />;
      case 'BRANCH':
        return <Target className="w-4 h-4" />;
      default:
        return <Building2 className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'BOARD':
        return 'Board';
      case 'EXECUTIVE':
        return 'Executive';
      case 'DEPT':
        return 'Department';
      case 'DIV':
        return 'Division';
      case 'BRANCH':
        return 'Branch';
      default:
        return type;
    }
  };

  // Recursive function to filter tree data
  const filterTreeData = (nodes: any[]): any[] => {
    return nodes.filter(node => {
      const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           node.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'ALL' || node.type === selectedType;
      
      // Filter children recursively
      const filteredChildren = node.children ? filterTreeData(node.children) : [];
      
      // Include node if it matches OR if any of its children match
      const nodeMatches = matchesSearch && matchesType;
      const hasMatchingChildren = filteredChildren.length > 0;
      
      if (nodeMatches || hasMatchingChildren) {
        return {
          ...node,
          children: filteredChildren
        };
      }
      
      return false;
    }).map(node => ({
      ...node,
      children: node.children ? filterTreeData(node.children) : []
    }));
  };

  // Filter data based on search and type
  const filteredData = filterTreeData(organogramData);

  // Recursive function to count nodes in tree
  const countNodes = (nodes: any[]): { total: number; departments: number; divisions: number; branches: number } => {
    let total = 0;
    let departments = 0;
    let divisions = 0;
    let branches = 0;
    
    nodes.forEach(node => {
      total++;
      if (node.type === 'DEPT') departments++;
      else if (node.type === 'DIV') divisions++;
      else if (node.type === 'BRANCH') branches++;
      
      if (node.children) {
        const childCounts = countNodes(node.children);
        total += childCounts.total;
        departments += childCounts.departments;
        divisions += childCounts.divisions;
        branches += childCounts.branches;
      }
    });
    
    return { total, departments, divisions, branches };
  };

  // Calculate statistics
  const stats = countNodes(organogramData);

  return (
    <>
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <PageHeader 
          title="Organogram" 
          subtitle="Manage organizational structure and hierarchy"
          right={
            <>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button 
                onClick={() => {
                  const executiveSecretary = organogramData.find(e => e.type === 'EXECUTIVE');
                  if (executiveSecretary) {
                    handleOpenCreateModal(executiveSecretary.id, 'DEPT');
                  }
                }}
                className="bg-slate-700 hover:bg-slate-800 text-white shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New
              </Button>
            </>
          }
        />

        {/* Breadcrumbs */}
        <div className="px-6 py-2">
          <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <a href="/dashboard" className="hover:text-gray-700">Dashboard</a>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-700 font-medium">Organogram</li>
            </ol>
          </nav>
        </div>

        {/* Controls */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search organizational units..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <option value="ALL">All Types</option>
                  <option value="BOARD">Board</option>
                  <option value="EXECUTIVE">Executive</option>
                  <option value="DEPT">Department</option>
                  <option value="DIV">Division</option>
                  <option value="BRANCH">Branch</option>
                </select>
              </div>
            </div>
            
            {/* Tree Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // This will be handled by the OrganogramViewer component
                }}
              >
                Expand All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // This will be handled by the OrganogramViewer component
                }}
              >
                Collapse All
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="grid grid-cols-4 gap-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="animate-pulse flex items-center">
                    <div className="p-4 bg-slate-200 rounded-lg w-10 h-10" />
                    <div className="ml-3 flex-1">
                      <div className="h-3 bg-slate-200 rounded w-24 mb-2" />
                      <div className="h-6 bg-slate-200 rounded w-16" />
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <>
                <Card className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Building2 className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Total Units</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Building2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Departments</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.departments}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-violet-100 rounded-lg">
                      <Network className="w-5 h-5 text-violet-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Divisions</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.divisions}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Target className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Branches</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.branches}</p>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>


        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Organogram Viewer */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-sm text-muted-foreground">Loading organizational structure...</p>
                  </div>
                </div>
              ) : (
              <OrganogramViewer
                data={filteredData}
                onNodeClick={handleNodeClick}
                onNodeAdd={handleOpenCreateModal}
                onNodeEdit={handleNodeEdit}
                onNodeDelete={handleNodeDelete}
              />
              )}
            </div>
            
            {/* Side Panel */}
            {selectedNode && (
              <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {selectedNode.name}
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Type</Label>
                    <div className="flex items-center mt-1">
                      {getTypeIcon(selectedNode.type)}
                      <span className="ml-2 text-sm text-gray-900">
                        {getTypeLabel(selectedNode.type)}
                      </span>
                    </div>
                  </div>
                  {/* Description removed as it's not part of the type */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Level</Label>
                    <p className="mt-1 text-sm text-gray-900">{selectedNode.level}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
    {/* Create Modal */}
    <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Unit"
        description="Add a new organizational unit to the structure"
      >
          <form onSubmit={handleCreateSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                Unit Name *
              </Label>
              <Input
                id="name"
                value={createForm.name}
                onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                placeholder="Enter unit name"
                required
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="type" className="text-sm font-medium text-gray-700 mb-2 block">
                Unit Type *
              </Label>
              <select
                id="type"
                value={createForm.type}
                onChange={(e) => setCreateForm({...createForm, type: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {createForm.parentType === 'EXECUTIVE' && (
                  <>
                    <option value="DEPT">Department</option>
                    <option value="DIV">Division</option>
                    <option value="BRANCH">Branch</option>
                  </>
                )}
                {createForm.parentType === 'DEPT' && (
                  <>
                    <option value="DIV">Division</option>
                    <option value="BRANCH">Branch</option>
                  </>
                )}
                {createForm.parentType === 'DIV' && (
                  <option value="BRANCH">Branch</option>
                )}
                {!createForm.parentType && (
                  <option value="DEPT">Department</option>
                )}
              </select>
            </div>
            
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                Description
              </Label>
              <Input
                id="description"
                value={createForm.description}
                onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                placeholder="Enter unit description"
                className="w-full"
              />
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="p-3 bg-gray-100 rounded text-xs text-gray-600">
                <p>Parent ID: {createForm.parentId}</p>
                <p>Type: {createForm.type}</p>
                <p>Parent Type: {createForm.parentType}</p>
                <p>Available options: {createForm.parentType === 'DEPT' ? 'DIV, BRANCH' : createForm.parentType === 'EXECUTIVE' ? 'DEPT, DIV, BRANCH' : createForm.parentType === 'DIV' ? 'BRANCH' : 'DEPT'}</p>
              </div>
            )}
            
            <ModalFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
                disabled={isSaving}
              >
                {isSaving ? 'Creating...' : 'Create Unit'}
              </Button>
            </ModalFooter>
          </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Unit"
        description="Update organizational unit information"
      >
          <form onSubmit={handleEditSubmit} className="space-y-6">
            <div>
              <Label htmlFor="edit-name" className="text-sm font-medium text-gray-700 mb-2 block">
                Unit Name *
              </Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                placeholder="Enter unit name"
                required
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-description" className="text-sm font-medium text-gray-700 mb-2 block">
                Description
              </Label>
              <Input
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                placeholder="Enter unit description"
                className="w-full"
              />
            </div>
            
            <ModalFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditModal(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
                disabled={isSaving}
              >
                {isSaving ? 'Updating...' : 'Update Unit'}
              </Button>
        </ModalFooter>
      </form>
      </Modal>

      {/* Confirmation Dialog */}
      {confirmAction && (
        <ConfirmationDialog
          isOpen={showConfirmDialog}
          onClose={() => {
            setShowConfirmDialog(false);
            setConfirmAction(null);
          }}
          onConfirm={confirmAction.onConfirm}
          title={confirmAction.title}
          message={confirmAction.message}
          variant={confirmAction.variant}
          confirmText="Yes, Continue"
          cancelText="Cancel"
        />
      )}
    </>
  );
};

export default Organogram;