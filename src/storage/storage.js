function updateProjectList(projectId, name){
    const data = localStorage.getItem("projects");
    const projectObject = data ? JSON.parse(data) : {};
    const newObject = {...projectObject, ...{projectId, name}};
    localStorage.setItem("projects",     JSON.stringify(newObject));
}
