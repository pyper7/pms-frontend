import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

type Breadcrumb = {
  label: string;
  href?: string;
};

type Props = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
};

const PageHeader: React.FC<Props> = ({ title, subtitle, right, breadcrumbs }) => {
  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-2 text-body-small text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          {breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="w-4 h-4" />
              {breadcrumb.href ? (
                <Link 
                  to={breadcrumb.href} 
                  className="hover:text-foreground transition-colors"
                >
                  {breadcrumb.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">
                  {breadcrumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      
      {/* Header Content */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-lead text-muted-foreground mt-2">{subtitle}</p>
          )}
        </div>
        {right && <div className="flex items-center space-x-3">{right}</div>}
      </div>
    </div>
  );
};

export default PageHeader;


