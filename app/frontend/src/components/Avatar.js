// app/frontend/src/components/Avatar.js
import React, { useMemo } from 'react';
import * as avatars from '@dicebear/avatars';
import * as style from '@dicebear/avatars-avataaars-sprites';

const Avatar = ({ options }) => {
  const avatar = useMemo(() => {
    return avatars.createAvatar(style, {
      size: 128,
      ...options
    });
  }, [options]);

  return <img src={`data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`} alt="Avatar" />;
};

export default Avatar;
