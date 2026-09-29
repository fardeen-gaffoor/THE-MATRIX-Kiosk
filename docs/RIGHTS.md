# Archive Content Rights & Licensing

The software code in this repository is licensed under the [MIT License](../LICENSE). However, the historical content processed, displayed, and stored by this software operates under separate rights statuses.

## Important Constraints

1. **No Fabrication:** The system is explicitly designed to prevent the fabrication of historical facts, quotes, or citations. AI outputs are strictly grounded in retrieved passages (RAG).
2. **Immutability of Originals:** All original uploaded scans and manuscripts are stored immutably in the object storage layer with SHA-256 checksums to guarantee authenticity.
3. **Rights Tracking:** The Dublin Core-based data model explicitly requires a `rights_status` and `source` field for every item ingested into the database.

## Supplied Assets
Certain visual assets, such as the photographs of Dr. Ambedkar located in `/assets/background/` and the chakra image frames in `/assets/chakra-frames/`, are supplied by the project owners and may not fall under the MIT license. Do not reuse these assets outside of this deployment without explicit permission from the copyright holders.

## External Archival Material
Any historical documents, manuscripts, speeches, or audio recordings uploaded into the system by administrators remain the property of their respective copyright holders, unless explicitly marked as Public Domain. Ensure that you have the appropriate licenses to ingest, display, and create derivatives of these materials before uploading them to the platform.
