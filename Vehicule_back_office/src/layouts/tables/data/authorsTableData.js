import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import team2 from "assets/images/team-2.jpg";
import React, { useState, useEffect } from "react";
import Axios from "axios"; 


export default function data() {
  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );
  const [annonces, setAnnonces] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get("http://localhost:1817/api/annonce/accepte_annonce/3");
        const data = response.data;

        const rowsData = await Promise.all(data.map(async (annonceItem) => {
          const utilisateurResponse = await Axios.get(`http://localhost:1817/api/user/id_utilisateur/${annonceItem.id_utilisateur}`);
          const voitureResponse = await Axios.get(`http://localhost:1817/api/voiture/${annonceItem.id_voiture}`);
          const utilisateurNom = utilisateurResponse.data.nom;
          const id_marque = voitureResponse.data.id_marque;
          
          const marqueResponse = await Axios.get(`http://localhost:1817/api/marque/${id_marque}`);
          const nom_marque = marqueResponse.data.nom_marque;

          return {
            annonce: <Author image={team2} name={utilisateurNom} email={nom_marque} />,
            status: (
              <MDBox ml={-1}>
                <MDBadge badgeContent="Valider" color="success" variant="gradient" size="sm" />
              </MDBox>
            ),
            employed: (
              <MDBox ml={-1}>
                <MDBadge badgeContent="Decliner" color="dark" variant="gradient" size="sm" />
              </MDBox>
            ),
            action: (
              <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                Edit
              </MDTypography>
            ),
          };
        }));

        setAnnonces(rowsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const rows = annonces || [];

  // ... (rest of the component)

  return {
    columns: [
      { Header: "Annonces", accessor: "annonce", width: "45%", align: "left" },
      { Header: "Validation", accessor: "status", align: "center" },
      { Header: "Refus", accessor: "employed", align: "center" },
    ],
    rows: rows,
  };
}
