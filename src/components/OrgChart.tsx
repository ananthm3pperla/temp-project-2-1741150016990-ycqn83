import React from 'react';
import { getOrgChart } from '../lib/mockData';

const OrgChart = ({ rootId }: { rootId: string }) => {
  const orgData = getOrgChart(rootId);

  const renderNode = (node: any) => (
    <div key={node.id} className="org-node">
      <img src={node.avatar} alt={node.name} />
      <h3>{node.name}</h3>
      <p>{node.role}</p>
      {node.children && node.children.length > 0 && (
        <div className="children">
          {node.children.map((child: any) => renderNode(child))}
        </div>
      )}
    </div>
  );

  return orgData ? (
    <div className="org-chart">
      {renderNode(orgData)}
    </div>
  ) : null;
};

export default OrgChart;