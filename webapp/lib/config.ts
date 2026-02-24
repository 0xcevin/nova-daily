export const CONFIG = {
  packageId: '0x64c8a15b8b135522d8af8e658817ced5a447a35f59ffa7784daac5ac27f7f8c9',
  registryId: '0xbde6dae4a2ad1d51e01733ac8fa248bbe4350825d9237ecbf85919a9fb47c4ff',
  identityId: '0xa2b87b13dba09113f7e6c1a964f45a4ca1d9e3af5bcc2d4f7704cdde08450677',
  walrusBaseUrl: 'https://walrus-testnet.blockscope.net/v1/',
};

export interface Episode {
  id: string;
  episodeId: number;
  date: string;
  title: string;
  summary: string;
  blobId: string;
  tags: string[];
  durationSecs: number;
  walrusUrl: string;
}

export interface NovaIdentity {
  name: string;
  bio: string;
  avatarBlobId: string;
  admin: string;
}