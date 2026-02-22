import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { SearchIcon, XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router";

interface SmartSearchProps {
  onSearch?: (query: string, context: string) => void;
  placeholder?: string;
}

const SmartSearch = ({ onSearch, placeholder }: SmartSearchProps) => {
  const [query, setQuery] = useState("");
  const location = useLocation();

  // 根据当前路径确定上下文
  const getContext = (): string => {
    const pathname = location.pathname;

    if (pathname.includes('/dynamics')) {
      return 'dynamics';
    } else if (pathname.includes('/settings') || pathname.includes('/profile')) {
      return 'settings';
    } else {
      // 默认为主页/订阅者页面
      return 'subscribers';
    }
  };

  const context = getContext();

  // 根据上下文动态设置占位符文本
  const getPlaceholder = () => {
    if (placeholder) return placeholder;

    switch (context) {
      case 'dynamics':
        return '搜索动态内容...';
      case 'settings':
        return '搜索设置项...';
      case 'subscribers':
      default:
        return '搜索订阅者...';
    }
  };

  const handleSearch = () => {
    if (query.trim() && onSearch) {
      onSearch(query, context);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setQuery('');
    }
  };

  // 当路由改变时重置查询
  useEffect(() => {
    setQuery('');
  }, [location.pathname]);

  return (
    <div className="relative flex items-center w-full">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={getPlaceholder()}
        className="pl-10 pr-8 py-2 w-full rounded-lg border border-input bg-background focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary"
      />
      <SearchIcon
        className="absolute left-3 h-4 w-4 text-muted-foreground"
      />
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setQuery('')}
          className="absolute right-2 h-6 w-6 rounded-full p-0 hover:bg-transparent"
        >
          <XIcon className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </Button>
      )}
    </div>
  );
};

export default SmartSearch;