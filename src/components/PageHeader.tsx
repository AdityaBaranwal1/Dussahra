interface Props {
    title: string;
    subtitle?: string;
    templeArch?: boolean;
    dark?: boolean;
    raised?: boolean;
    shimmer?: boolean;
}

export const PageHeader = ({
    title,
    subtitle,
    templeArch = false,
    dark = false,
    raised = false,
    shimmer = false,
}: Props) => {
    const wrapperClass = [
        'page-header',
        templeArch && 'temple-arch',
        dark && 'page-header-dark',
        raised && 'z-2',
    ].filter(Boolean).join(' ');

    const titleClass = shimmer ? 'page-title text-shimmer' : 'page-title';

    return (
        <div className={wrapperClass}>
            <div className="container">
                <h1 className={titleClass}>{title}</h1>
                {subtitle && <p className="page-subtitle">{subtitle}</p>}
            </div>
        </div>
    );
};
