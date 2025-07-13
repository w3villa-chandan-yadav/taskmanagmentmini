NATIVEQUERIES = {
    FETCHALLUSER : "SELECT * FROM users ;",
    FETCHISVALIDATED: "SELECT * FROM users u JOIN emailVerificatoins  e ON u.id = e.userId WHERE token = ? ORDER BY expiresAt DESC LIMIT 1 ;",
    ISMEMBEROFGROP: "SELECT  * FROM `groups` g JOIN participans p ON g.id = p.groupId WHERE p.userId = ? ;",
    FINDGROUPOFUSER: "SELECT g.id , g.groupName ,g.createdAt FROM `groups` g JOIN participans p ON g.id = p.groupId WHERE p.userId = ? ORDER BY createdAt DESC;",
    ISMEMBEROFGROUPTOFETCH: "SELECT  * FROM `groups` g JOIN participans p ON g.id = p.groupId WHERE p.userId = ? AND g.id = ? ;",
    TASKOFSINGLEGROUP : "SELECT * FROM `groups` g JOIN tasks t ON g.id =  t.groupId WHERE g.id = ? ;",
    // TOATALPARTICIPANTS: "SELECT g.id AS groupId, g.groupName, COUNT(DISTINCT p.id) AS participantCount, COUNT(DISTINCT t.id) AS taskCount FROM participans p JOIN `groups` g ON p.groupId = g.id LEFT JOIN tasks t ON g.id = t.groupId WHERE p.groupId IN (SELECT groupId FROM participans WHERE userId = ? AND userType = 'Owner') GROUP BY g.id, g.groupName;"
    TOATALPARTICIPANTS: "SELECT g.id AS groupId, g.groupName, COUNT(DISTINCT CASE WHEN p.userId != ? THEN p.id END) AS participantCount, COUNT(DISTINCT t.id) AS taskCount, COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) AS completedTaskCount FROM participans p JOIN `groups` g ON p.groupId = g.id LEFT JOIN tasks t ON g.id = t.groupId WHERE p.groupId IN (SELECT groupId FROM participans WHERE userId = ? AND userType = 'Owner') GROUP BY g.id, g.groupName;"
} 



module.exports = { NATIVEQUERIES }