import React from 'react';

const navigation = [
  { name: 'Tests', key: 'tests' },
  { name: 'Students', key: 'students' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const MenuBar = ({ selectedMenu, setSelectedMenu }) => {
  return (
    <div className="flex w-full">
      {navigation.map((item) => (
        <button
          key={item.key}
          onClick={() => setSelectedMenu(item.key)}
          className={classNames(
            selectedMenu === item.key ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            'flex-1 text-center px-3 py-2 text-sm font-medium',
          )}
          aria-current={selectedMenu === item.key ? 'page' : undefined}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};

export default MenuBar;
