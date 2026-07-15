export interface SiteRequest {
    nom: string;
    ville : string;
    pays : string;
    responsable?: string;
}

export interface SiteResponse {
  id: number;
  nom: string;
  ville: string;
  pays: string;
  responsable?: string;
}